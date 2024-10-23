
export default function QuestionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto">
        {children}
      </main>
    </div>
  );
}
