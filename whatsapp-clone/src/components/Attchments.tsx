import React, { useRef } from "react";

import {
  Image,
  Camera,
  FileText,
  Music,
  Video,
  MapPin,
  Contact,
  
  X,
} from "lucide-react";

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;

  /*
    File handlers
  */
  onImageSelect: (
    file: File
  ) => void;

  onVideoSelect: (
    file: File
  ) => void;

  onAudioSelect: (
    file: File
  ) => void;

  onDocumentSelect: (
    file: File
  ) => void;

  /*
    Other handlers
  */
  onLocationClick: () => void;
  onContactClick: () => void;
  onPollClick: () => void;
}

const AttachmentModal: React.FC<
  AttachmentModalProps
> = ({
  isOpen,
  onClose,

  onImageSelect,
  onVideoSelect,
  onAudioSelect,
  onDocumentSelect,

  onLocationClick,
  onContactClick,
  onPollClick,
}) => {
  /*
    Hidden input refs
  */
  const imageInputRef =
    useRef<HTMLInputElement>(null);

  const videoInputRef =
    useRef<HTMLInputElement>(null);

  const audioInputRef =
    useRef<HTMLInputElement>(null);

  const documentInputRef =
    useRef<HTMLInputElement>(null);

  const cameraInputRef =
    useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  /*
    Handle file selection
  */
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (file: File) => void
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    callback(file);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      {/* Hidden Inputs */}

      {/* Gallery */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) =>
          handleFileChange(
            e,
            onImageSelect
          )
        }
      />

      {/* Video */}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) =>
          handleFileChange(
            e,
            onVideoSelect
          )
        }
      />

      {/* Audio */}
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        hidden
        onChange={(e) =>
          handleFileChange(
            e,
            onAudioSelect
          )
        }
      />

      {/* Document */}
      <input
        ref={documentInputRef}
        type="file"
        hidden
        onChange={(e) =>
          handleFileChange(
            e,
            onDocumentSelect
          )
        }
      />

      {/* Camera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) =>
          handleFileChange(
            e,
            onImageSelect
          )
        }
      />

      {/* Modal */}
      <div className="w-full max-w-md bg-[#111] text-white rounded-t-3xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Share Attachment
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            <X />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-5">
          {/* Gallery */}
          <button
            onClick={() =>
              imageInputRef.current?.click()
            }
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
              <Image size={28} />
            </div>

            <span className="text-sm">
              Gallery
            </span>
          </button>

          {/* Camera */}
          <button
            onClick={() =>
              cameraInputRef.current?.click()
            }
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center">
              <Camera size={28} />
            </div>

            <span className="text-sm">
              Camera
            </span>
          </button>

          {/* Video */}
          <button
            onClick={() =>
              videoInputRef.current?.click()
            }
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
              <Video size={28} />
            </div>

            <span className="text-sm">
              Video
            </span>
          </button>

          {/* Audio */}
          <button
            onClick={() =>
              audioInputRef.current?.click()
            }
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center">
              <Music size={28} />
            </div>

            <span className="text-sm">
              Audio
            </span>
          </button>

          {/* Document */}
          <button
            onClick={() =>
              documentInputRef.current?.click()
            }
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
              <FileText size={28} />
            </div>

            <span className="text-sm">
              Document
            </span>
          </button>

          {/* Location */}
          <button
            onClick={() => {
              onLocationClick();
              onClose();
            }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <MapPin size={28} />
            </div>

            <span className="text-sm">
              Location
            </span>
          </button>

          {/* Contact */}
          <button
            onClick={() => {
              onContactClick();
              onClose();
            }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center">
              <Contact size={28} />
            </div>

            <span className="text-sm">
              Contact
            </span>
          </button>

          {/* Poll */}
          <button
            onClick={() => {
              onPollClick();
              onClose();
            }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center">
             <span>nothing</span>
            </div>

            <span className="text-sm">
              Poll
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;