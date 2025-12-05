import { Layout } from "@/components/Layout";
import { QuestionForm } from "@/components/QuestionForm";

export default function AddQuestion() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-secondary glow-text-cyan">
            Add Question
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-secondary">$</span> ./add --question
          </p>
        </div>

        <div className="terminal-card">
          <QuestionForm />
        </div>
      </div>
    </Layout>
  );
}
