import { useState, useEffect, useRef, useCallback } from "react";
import { unstable_usePrompt } from "react-router-dom";

const useTripDraft = (draftKey, formData, isActive) => {
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [savedDraft, setSavedDraft] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const initialSnapshotRef = useRef(null);
  const isDirtyRef = useRef(false);
  const isActiveRef = useRef(isActive);
  const formDataRef = useRef(formData);
  const debounceRef = useRef(null);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  formDataRef.current = formData;

  useEffect(() => {
    if (isActive) {
      initialSnapshotRef.current = JSON.stringify(formData);
      setIsDirty(false);
      isDirtyRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useEffect(() => {
    if (!isActive || initialSnapshotRef.current === null) {
      setIsDirty(false);
      isDirtyRef.current = false;
      return;
    }
    const dirty = JSON.stringify(formData) !== initialSnapshotRef.current;
    setIsDirty(dirty);
    isDirtyRef.current = dirty;
  }, [formData, isActive]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const data = JSON.parse(raw);
        setHasSavedDraft(true);
        setSavedDraft(data);
      }
    } catch {
      // ignore
    }
  }, [draftKey]);

  useEffect(() => {
    if (!isActive || !isDirty) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(formData));
      } catch {
        // ignore quota errors
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData, isActive, isDirty, draftKey]);

  useEffect(() => {
    const handler = (e) => {
      if (isDirtyRef.current && isActiveRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  unstable_usePrompt({
    when: isActive && isDirty,
    message:
      "You have unsaved changes. Are you sure you want to leave this page?",
  });

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
    setHasSavedDraft(false);
    setSavedDraft(null);
    setIsDirty(false);
    isDirtyRef.current = false;
  }, [draftKey]);

  const discardDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
    setHasSavedDraft(false);
    setSavedDraft(null);
  }, [draftKey]);

  return { hasSavedDraft, savedDraft, clearDraft, discardDraft, isDirty };
};

export default useTripDraft;
