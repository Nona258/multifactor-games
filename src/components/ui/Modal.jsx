/**
 * Modal component - centered overlay dialog
 */
export function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in px-3 md:px-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl xl:max-w-4xl mx-auto animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="border-b border-gray-200 px-5 py-4 md:px-8 md:py-5">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-5 md:px-8 md:py-8">{children}</div>

        {/* Footer */}
        {footer && <div className="border-t border-gray-200 px-5 py-4 md:px-8 md:py-5">{footer}</div>}
      </div>
    </div>
  );
}
