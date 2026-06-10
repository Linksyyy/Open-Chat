export default function ChatInput() {
  return (
    <form className="flex w-full items-center gap-2 pt-4 pb-2">
      <input
        className="flex-1 bg-p-2 text-foreground px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-s-1 transition-all shadow-sm"
        placeholder="Type a message..."
      />
      <button
        type="submit"
        className="bg-s-1 hover:bg-s-0 text-white px-6 py-3 rounded-full font-medium transition-colors cursor-pointer shadow-sm"
      >
        Send
      </button>
    </form>
  );
}
