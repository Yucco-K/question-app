
export default function UserDetailLayout ({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto py-8">
        {children}
      </main>
    </div>
  );
}
