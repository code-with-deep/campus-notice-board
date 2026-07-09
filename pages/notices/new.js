import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ErrorMessage from "@/components/ErrorMessage";
import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";
import { apiRequest, getErrorMessage } from "@/utils/helpers";

export default function NewNoticePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (values) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setServerErrors(null);
    setFormError("");

    try {
      await apiRequest("/api/notices", {
        method: "POST",
        body: JSON.stringify(values),
      });

      toast.success("Notice created successfully.");
      await router.push("/");
    } catch (submitError) {
      if (submitError.details) {
        setServerErrors(submitError.details);
      }

      const message = getErrorMessage(submitError, "Unable to create notice. Please try again.");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Create Notice | Campus Notice Board">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create Notice</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Publish a new campus announcement with category, priority, and publish date.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          {formError ? <ErrorMessage message={formError} className="mb-6" /> : null}
          <NoticeForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            serverErrors={serverErrors}
            submitLabel="Create Notice"
            showReset
          />
        </div>
      </section>
    </Layout>
  );
}
