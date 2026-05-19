import React from "react";
import {
  Image,
  Camera,
  FileText,
  Music,
  MapPin,
  User,
  
  Contact,
  X,
} from "lucide-react";

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;

  /*
    Attachment handlers
  */
  onGalleryClick: () => void;
  onCameraClick: () => void;
  onDocumentClick: () => void;
  onAudioClick: () => void;
  onLocationClick: () => void;
  onContactClick: () => void;
  onPollClick: () => void;
}

interface AttachmentItem {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  onClick: () => void;
}

const AttachmentModal: React.FC<
  AttachmentModalProps
> = ({
  isOpen,
  onClose,
  onGalleryClick,
  onCameraClick,
  onDocumentClick,
  onAudioClick,
  onLocationClick,
  onContactClick,
  onPollClick,
}) => {
  /*
    Prevent render if modal closed
  */
  if (!isOpen) return null;

  /*
    All attachment items
  */
  const attachmentItems: AttachmentItem[] =
    [
      {
        title: "Gallery",
        icon: <Image size={26} />,
        bgColor: "bg-purple-500",
        onClick: onGalleryClick,
      },

      {
        title: "Camera",
        icon: <Camera size={26} />,
        bgColor: "bg-pink-500",
        onClick: onCameraClick,
      },

      {
        title: "Document",
        icon: <FileText size={26} />,
        bgColor: "bg-blue-500",
        onClick: onDocumentClick,
      },

      {
        title: "Audio",
        icon: <Music size={26} />,
        bgColor: "bg-orange-500",
        onClick: onAudioClick,
      },

      {
        title: "Location",
        icon: <MapPin size={26} />,
        bgColor: "bg-green-500",
        onClick: onLocationClick,
      },

      {
        title: "Contact",
        icon: <Contact size={26} />,
        bgColor: "bg-cyan-500",
        onClick: onContactClick,
      },

      {
        title: "Poll",
        icon: "nothing",
        bgColor: "bg-red-500",
        onClick: onPollClick,
      },
    ];

  return (
    <div className="fixed inset-0 z-50  flex items-end justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal */}
      <div className="w-full max-w-md bg-white rounded-t-3xl p-6 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Share Attachment
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Attachment grid */}
        <div className="grid grid-cols-3 gap-5">
          {attachmentItems.map(
            (item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className="flex flex-col items-center gap-3"
              >
                {/* Circle icon */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg ${item.bgColor}`}
                >
                  {item.icon}
                </div>

                {/* Title */}
                <span className="text-sm font-medium">
                  {item.title}
                </span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;