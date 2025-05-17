import { Play, PlayCircle } from "lucide-react"
import React from "react"
import ReactPlayer from "react-player"


export default function VideoPlayer({ activeSequence }) {
    console.log(activeSequence)
  return (
    <section className="md:w-3/4 bg-black rounded-md overflow-hidden shadow-md">
      <div className="aspect-video relative">
        {activeSequence && activeSequence.video.link ? (
          <ReactPlayer
            url={activeSequence.video.link}
            width="100%"
            height="100%"
            playing
            className="react-player"
            wrapper="div"
            playIcon={<button className="bg-black hover:bg-primary text-white p-3 rounded-full"><Play className="w-8 h-8" /></button>}
            light={true}
            volume={0.5}
            muted={false}
            loop={false}
            playbackRate={1}
            width="100%"
            height="100%"
            style={{
              border: "none",
              borderRadius: "0.5rem",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload", // Disable download button
                  style: {
                    objectFit: "contain",
                  },
                },
                sources: [
                  {
                    src: activeSequence.video.link,
                    type: "video/mp4",
                  },
                ],
              },
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <p className="text-white text-xl">Select a lesson to start</p>
          </div>
        )}
        {activeSequence && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h2 className="text-white text-xl font-semibold">{activeSequence.title}</h2>
          </div>
        )}
      </div>
    </section>
  )
}

