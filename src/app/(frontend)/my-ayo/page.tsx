export default function MyAyoPage() {
  return (
    <main>
      <iframe
        src="https://calendar.google.com/calendar/embed?src=d4e4e881da9aa9c00cd2e9cb6a396106416b51b124e4051464075206f5137a06%40group.calendar.google.com&ctz=Pacific%2FAuckland"
        className="ml-30 border: 0"
        width="800"
        height="600"
      ></iframe>
      <div className="flex">
        <button className="p-3 ml-30 border-black border-2 rounded-md">
          <p>Add to Google Calendar</p>
        </button>
        <button className="p-3 ml-30 border-black border-2 rounded-md">
          <p>Subscribe on iPhone / Apple Calendar</p>
        </button>
        <button className="p-3 ml-30 border-black border-2 rounded-md">
          <p>Copy ICS link</p>
        </button>
      </div>
    </main>
  )
}
