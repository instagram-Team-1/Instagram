import * as Avatar from "@radix-ui/react-avatar";

export function SuggestionsSidebar() {
  const currentUser = {
    name: "kohaox",
    subtitle: "Жоло. Энжа",
    image: "/avatars/kohaox.jpg",
  };

  const suggestions = [
    {
      name: "Jolo",
      subtitle: "Followed by Saraa",
      image: "/avatars/Goo.jpg",
    },
    {
      name: "Lussy",
      subtitle: "Followed by Adalend + 4 more",
      image: "/avatars/letryka.jpg",
    },
    {
      name: "Lala",
      subtitle: "Followed by Henk + 2 more",
    },
    {
      name: "cloudnine_mongolia",
      subtitle: "Followed by Ruby + 14 more",
      image: "/avatars/cloudnine.jpg",
    },
    {
      name: "Nina",
      subtitle: "Followed by Lossy + 3 more",
    },
  ];

  return (
    <div className="hidden lg:block w-[300px] px-4 py-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Avatar.Root className="h-10 w-10 rounded-full overflow-hidden">
            <Avatar.Image
              src={currentUser.image}
              alt={currentUser.name}
              className="object-cover w-full h-full"
            />
            <Avatar.Fallback className="bg-gray-700 text-white flex items-center justify-center h-full w-full text-xs uppercase">
              {currentUser.name.charAt(0)}
            </Avatar.Fallback>
          </Avatar.Root>
          <div className="flex flex-col leading-4">
            <span className="text-sm font-semibold">{currentUser.name}</span>
            <span className="text-xs text-gray-400">
              {currentUser.subtitle}
            </span>
          </div>
        </div>
        <button className="text-blue-400 text-sm font-medium hover:text-white">
          Switch
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-400 font-semibold">
          Suggested for you
        </span>
        <button className="text-white text-sm font-medium hover:text-gray-400">
          See All
        </button>
      </div>

      <div className="space-y-4">
        {suggestions.map((user, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar.Root className="h-10 w-10 rounded-full overflow-hidden bg-gray-800">
                <Avatar.Image
                  src={user.image}
                  alt={user.name}
                  className="object-cover w-full h-full"
                />
                <Avatar.Fallback className="text-white-500 flex items-center justify-center h-full w-full text-xs uppercase">
                  {user.name.charAt(0)}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="flex flex-col leading-4">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-gray-400 max-w-[160px] truncate">
                  {user.subtitle}
                </span>
              </div>
            </div>
            <button className="text-blue-400 text-sm font-medium hover:text-white">
              Follow
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-[11px] text-gray-500 leading-5 space-y-1">
        <p className="text-wrap space-x-2">
          {["About", "Help", "Press", "API", "Jobs", "Privacy", "Terms"].map(
            (text, i) => (
              <span key={i} className="hover:underline cursor-pointer">
                {text}
              </span>
            )
          )}
        </p>
        <p className="text-wrap space-x-2">
          {["Locations", "Language", "Meta Verified"].map((text, i) => (
            <span key={i} className="hover:underline cursor-pointer">
              {text}
            </span>
          ))}
        </p>

        <p className="mt-2">© 2025 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
}
