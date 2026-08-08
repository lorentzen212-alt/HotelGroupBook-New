import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";

type ContentType = "text" | "image";

type ContentMap = Record<string, string>;

type EditModeContextValue = {
  isAdmin: boolean;
  editing: boolean;
  dirty: boolean;
  saving: boolean;
  startEditing: () => void;
  stopEditing: () => void;
  getValue: (contentKey: string, fallback: string) => string;
  setDraft: (contentKey: string, value: string) => void;
  registerType: (contentKey: string, type: ContentType) => void;
  save: () => Promise<void>;
  cancel: () => void;
  uploadImage: (file: File) => Promise<string>;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useEditMode must be used inside <EditModeProvider />");
  return ctx;
}

function splitKey(contentKey: string) {
  const parts = contentKey.split(".");
  if (parts.length < 2) return { section: "general", key: contentKey };
  return { section: parts[0] as string, key: parts.slice(1).join(".") };
}

export function EditModeProvider({
  pageKey,
  children,
}: {
  pageKey: string;
  children: ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState<ContentMap>({});
  const [drafts, setDrafts] = useState<ContentMap>({});
  const [types, setTypes] = useState<Record<string, ContentType>>({});
  const [saving, setSaving] = useState(false);

  // Load persisted content (public read).
  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase
        .from("page_content")
        .select("section_key, content_key, value")
        .eq("page_key", pageKey);
      if (!active || !data) return;
      const map: ContentMap = {};
      for (const row of data) map[`${row.section_key}.${row.content_key}`] = row.value;
      setSaved(map);
    })();
    return () => {
      active = false;
    };
  }, [pageKey]);

  // Determine admin status.
  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        if (active) setIsAdmin(false);
        return;
      }
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (active) setIsAdmin(data === true);
    };
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void check();
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const getValue = useCallback(
    (contentKey: string, fallback: string) =>
      drafts[contentKey] ?? saved[contentKey] ?? fallback,
    [drafts, saved],
  );

  const setDraft = useCallback((contentKey: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [contentKey]: value }));
  }, []);

  const registerType = useCallback((contentKey: string, type: ContentType) => {
    setTypes((prev) => (prev[contentKey] === type ? prev : { ...prev, [contentKey]: type }));
  }, []);

  const cancel = useCallback(() => setDrafts({}), []);

  const save = useCallback(async () => {
    const entries = Object.entries(drafts);
    if (entries.length === 0) return;
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const rows = entries.map(([contentKey, value]) => {
        const { section, key } = splitKey(contentKey);
        return {
          page_key: pageKey,
          section_key: section,
          content_key: key,
          value,
          content_type: types[contentKey] ?? "text",
          updated_by: userData.user?.id ?? null,
        };
      });
      const { error } = await supabase
        .from("page_content")
        .upsert(rows, { onConflict: "page_key,section_key,content_key" });
      if (error) throw error;
      setSaved((prev) => ({ ...prev, ...drafts }));
      setDrafts({});
    } finally {
      setSaving(false);
    }
  }, [drafts, pageKey, types]);

  const uploadImage = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${pageKey}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("page-images").upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw error;
    // Bucket is private, so persist a long-lived signed URL (10 years).
    const { data, error: signError } = await supabase.storage
      .from("page-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (signError || !data) throw signError ?? new Error("Could not create image URL");
    return data.signedUrl;
  }, [pageKey]);

  const value = useMemo<EditModeContextValue>(
    () => ({
      isAdmin,
      editing: editing && isAdmin,
      dirty: Object.keys(drafts).length > 0,
      saving,
      startEditing: () => setEditing(true),
      stopEditing: () => setEditing(false),
      getValue,
      setDraft,
      registerType,
      save,
      cancel,
      uploadImage,
    }),
    [isAdmin, editing, drafts, saving, getValue, setDraft, registerType, save, cancel, uploadImage],
  );

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}