const Loading = () => {
  return (
    <>
      <div className="fixed inset-0 bg-white h-screen w-full z-40"></div>
      <div className="fixed bottom-10 left-10 z-50">
        <div className="animate-spin w-10 h-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          >
            <path
              d="M12 2v4m0 12v4m10-10h-4M6 12H2m4.343-5.657L4.929 4.929m12.728 12.728 2.121 2.121M6.343 6.343 4.222 4.222m12.728 12.728 2.121 2.121"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Loading;
