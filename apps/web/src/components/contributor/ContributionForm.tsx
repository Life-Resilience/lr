/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type ContributionDraft = {
  category: string;
  
  // Experience
  exp_title: string;
  exp_what: string;
  exp_when: string;
  exp_where: string;
  exp_worth: string;

  // Observation
  obs_title: string;
  obs_what: string;
  obs_where: string;
  obs_when: string;
  obs_why: string;

  // Research
  res_title: string;
  res_findings: string;
  res_method: string;
  res_sources: string;
  res_conclusion: string;

  // Evidence
  evi_title: string;
  evi_show: string;
  evi_context: string;
  evi_source: string;

  // Idea
  ida_title: string;
  ida_what: string;
  ida_why: string;
  ida_context: string;

  // Question
  qst_question: string;
  qst_why: string;
  qst_context: string;

  // Pattern
  pat_title: string;
  pat_what: string;
  pat_where_when: string;
  pat_why: string;

  // Other
  oth_title: string;
  oth_what: string;
  oth_context: string;
};

const emptyDraft: ContributionDraft = {
  category: "Experience",
  exp_title: "", exp_what: "", exp_when: "", exp_where: "", exp_worth: "",
  obs_title: "", obs_what: "", obs_where: "", obs_when: "", obs_why: "",
  res_title: "", res_findings: "", res_method: "", res_sources: "", res_conclusion: "",
  evi_title: "", evi_show: "", evi_context: "", evi_source: "",
  ida_title: "", ida_what: "", ida_why: "", ida_context: "",
  qst_question: "", qst_why: "", qst_context: "",
  pat_title: "", pat_what: "", pat_where_when: "", pat_why: "",
  oth_title: "", oth_what: "", oth_context: ""
};

export default function ContributionForm({
  initialCategory,
  onCancel,
}: {
  initialCategory: string;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [draft, setDraft] = useState<ContributionDraft>({ ...emptyDraft, category: initialCategory });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const saved = localStorage.getItem("lr-contribution-draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDraft((prev) => ({
          ...prev,
          ...parsed,
          category: initialCategory || parsed.category || "Experience",
        }));
      } catch (e) {}
    }
    setIsLoading(false);
  }, [initialCategory, supabase]);

  const saveDraft = (newDraft: ContributionDraft) => {
    setDraft(newDraft);
    localStorage.setItem("lr-contribution-draft", JSON.stringify(newDraft));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size must be under 10MB");
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError(null);

    localStorage.setItem("lr-contribution-draft", JSON.stringify(draft));

    if (!user) {
      router.push("/contribute/login?returnTo=/contributor/contribute");
      return;
    }

    try {
      let filePath = null;
      if (selectedFile) {
        setUploadProgress(10);
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const fullPath = `${user.id}/${fileName}`;
        
        const { error: uploadErrorData } = await supabase.storage
          .from('contributions')
          .upload(fullPath, selectedFile, { cacheControl: '3600', upsert: false });

        if (uploadErrorData) throw new Error(`Upload failed: ${uploadErrorData.message}`);
        filePath = fullPath;
        setUploadProgress(50);
      }

      // Map to flat structure for DB
      let mainTitle = "Untitled";
      let mainContent = "";
      let metadata: any = { file_path: filePath, file_name: selectedFile?.name };

      const cat = draft.category.toLowerCase();
      if (cat === "experience") {
        mainTitle = draft.exp_title; mainContent = draft.exp_what;
        metadata = { ...metadata, when: draft.exp_when, where: draft.exp_where, worth_sharing: draft.exp_worth };
      } else if (cat === "observation") {
        mainTitle = draft.obs_title; mainContent = draft.obs_what;
        metadata = { ...metadata, where: draft.obs_where, when: draft.obs_when, why_it_matters: draft.obs_why };
      } else if (cat === "research") {
        mainTitle = draft.res_title; mainContent = draft.res_findings;
        metadata = { ...metadata, method_or_context: draft.res_method, sources: draft.res_sources, conclusion: draft.res_conclusion };
      } else if (cat === "evidence") {
        mainTitle = draft.evi_title; mainContent = draft.evi_show;
        metadata = { ...metadata, evidence_context: draft.evi_context, source: draft.evi_source };
      } else if (cat === "idea") {
        mainTitle = draft.ida_title; mainContent = draft.ida_what;
        metadata = { ...metadata, why_it_matters: draft.ida_why, additional_context: draft.ida_context };
      } else if (cat === "question") {
        mainTitle = draft.qst_question.substring(0, 50) + "..."; mainContent = draft.qst_question;
        metadata = { ...metadata, why_investigate: draft.qst_why, context: draft.qst_context };
      } else if (cat === "pattern") {
        mainTitle = draft.pat_title; mainContent = draft.pat_what;
        metadata = { ...metadata, where_when: draft.pat_where_when, why_it_matters: draft.pat_why };
      } else {
        mainTitle = draft.oth_title; mainContent = draft.oth_what;
        metadata = { ...metadata, context: draft.oth_context };
      }

      const { data, error } = await supabase.from("contributions").insert({
        user_id: user.id,
        type: draft.category,
        title: mainTitle || "Untitled",
        content: mainContent,
        metadata,
        status: "SUBMITTED",
      }).select().single();

      if (error) throw error;
      setUploadProgress(100);
      localStorage.removeItem("lr-contribution-draft");
      router.push(`/contributor/contributions/${data.id}?success=true`);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to submit. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null;

  const renderField = (key: keyof ContributionDraft, label: string, isTextArea = false, required = false, placeholder = "") => {
    return (
      <div className="flex flex-col gap-4">
        <label htmlFor={key} className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </label>
        {isTextArea ? (
          <textarea
            id={key} required={required} rows={5} value={draft[key] as string} placeholder={placeholder}
            onChange={(e) => saveDraft({ ...draft, [key]: e.target.value })}
            className="w-full bg-transparent border border-border/40 p-4 text-base focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 resize-y rounded-sm"
          />
        ) : (
          <input
            id={key} type="text" required={required} value={draft[key] as string} placeholder={placeholder}
            onChange={(e) => saveDraft({ ...draft, [key]: e.target.value })}
            className="w-full bg-transparent border-b border-border/40 py-3 text-lg md:text-xl focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 rounded-none"
          />
        )}
      </div>
    );
  };

  const uploadField = (label = "Supporting Material") => (
    <div className="flex flex-col gap-4 border-t border-border/40 pt-12">
      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,.doc,.docx,.txt" />
      {!selectedFile ? (
        <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-border/40 rounded-sm p-8 text-center bg-muted/10 cursor-pointer hover:border-foreground/50 transition-colors">
          <span className="text-sm text-muted-foreground">Click to attach screenshots, documents, or files.</span>
        </div>
      ) : (
        <div className="border border-border/40 rounded-sm p-6 flex items-center justify-between bg-muted/5">
          <div className="flex flex-col">
            <span className="text-foreground font-medium">{selectedFile.name}</span>
            <span className="text-muted-foreground text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          {!isSubmitting && (
            <button type="button" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-red-500 hover:text-red-600 text-sm font-mono uppercase tracking-widest">
              Remove
            </button>
          )}
        </div>
      )}
      {uploadError && <span className="text-red-500 text-sm mt-2">{uploadError}</span>}
      {isSubmitting && selectedFile && !uploadError && (
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-foreground transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );

  const cat = draft.category.toLowerCase();
  
  return (
    <form className="flex flex-col gap-12" onSubmit={handleSubmit}>
      {cat === "experience" && (
        <>
          {renderField("exp_title", "Title", false, true, "What is this about?")}
          {renderField("exp_what", "What happened / what did you experience?", true, true, "Describe your experience...")}
          {renderField("exp_when", "When? (Optional)", false, false, "e.g. Last week")}
          {renderField("exp_where", "Where? (Optional)", false, false, "e.g. WhatsApp")}
          {renderField("exp_worth", "What made this worth sharing?", true, false, "Why is this notable?")}
          {uploadField()}
        </>
      )}
      {cat === "observation" && (
        <>
          {renderField("obs_title", "Title", false, true, "What is this about?")}
          {renderField("obs_what", "What did you observe?", true, true, "Describe the behavior or event...")}
          {renderField("obs_where", "Where did you observe it?", false, true, "e.g. A specific website or app")}
          {renderField("obs_when", "When? (Optional)", false, false, "e.g. Oct 2026")}
          {renderField("obs_why", "Why do you think it matters?", true, false, "Context for the observation")}
          {uploadField()}
        </>
      )}
      {cat === "research" && (
        <>
          {renderField("res_title", "Title", false, true)}
          {renderField("res_findings", "Research / findings", true, true, "Share your analysis...")}
          {renderField("res_method", "Method or context", true, false, "How did you find this?")}
          {renderField("res_sources", "Sources / references", true, false, "Links or citations")}
          {renderField("res_conclusion", "Key conclusion", true, false, "What is the main takeaway?")}
          {uploadField()}
        </>
      )}
      {cat === "evidence" && (
        <>
          {renderField("evi_title", "Title", false, true)}
          {renderField("evi_show", "What does this evidence show?", true, true, "Explain the context of the evidence...")}
          {renderField("evi_context", "Evidence/context", true, false)}
          {renderField("evi_source", "Source/context if applicable", true, false)}
          {uploadField()}
        </>
      )}
      {cat === "idea" && (
        <>
          {renderField("ida_title", "Title", false, true)}
          {renderField("ida_what", "What problem or idea should LR investigate?", true, true)}
          {renderField("ida_why", "Why does it matter?", true, false)}
          {renderField("ida_context", "Additional context", true, false)}
          {uploadField()}
        </>
      )}
      {cat === "question" && (
        <>
          {renderField("qst_question", "Question", true, true, "What is your question?")}
          {renderField("qst_why", "Why should LR investigate it?", true, false)}
          {renderField("qst_context", "Context", true, false)}
          {uploadField()}
        </>
      )}
      {cat === "pattern" && (
        <>
          {renderField("pat_title", "Title", false, true)}
          {renderField("pat_what", "What pattern did you notice?", true, true, "Describe the repeated behavior...")}
          {renderField("pat_where_when", "Where/when did you notice it?", false, false)}
          {renderField("pat_why", "Why does the pattern matter?", true, false)}
          {uploadField()}
        </>
      )}
      {cat === "other" && (
        <>
          {renderField("oth_title", "Title", false, true)}
          {renderField("oth_what", "What would you like to share?", true, true)}
          {renderField("oth_context", "Context", true, false)}
          {uploadField()}
        </>
      )}

      <div className="pt-8 flex items-center gap-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group w-fit flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.15em] text-background bg-foreground px-8 py-4 rounded-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Contribution"}
          {!isSubmitting && (
            <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
          )}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel} className="text-[13px] font-medium uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

