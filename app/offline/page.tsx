export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
      <div className="max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 p-10">
        <h1 className="text-3xl font-semibold">Offline mode</h1>
        <p className="mt-4 text-slate-400">The app is not connected to the network. You can continue working and data will sync once you are back online.</p>
      </div>
    </div>
  );
}
