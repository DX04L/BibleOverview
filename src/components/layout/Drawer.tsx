import { Person } from '../../types/genealogy';
import { X, BookOpen, User, Tag, MapPin } from 'lucide-react';

interface DrawerProps {
  person: Person | null;
  onClose: () => void;
}

export default function Drawer({ person, onClose }: DrawerProps) {
  if (!person) return null;

  return (
    <>
      {/* Mobile & Desktop backdrop on demand */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity md:hidden"
      />

      <div 
        className={`
          fixed z-50 bg-canvas border-border-subtle shadow-2xl transition-all duration-300 ease-in-out flex flex-col
          /* Mobile: Bottom Sheet */
          bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl border-t
          /* Desktop: Right Slide-out Drawer */
          md:bottom-auto md:top-0 md:right-0 md:left-auto md:h-full md:w-88 md:max-h-full md:rounded-none md:border-l md:border-t-0
        `}
      >
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-1 md:hidden" />

        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary leading-tight">
                {person.nameZh}
              </h2>
              <span className="text-xs text-text-secondary font-medium">
                {person.nameEn}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-text-secondary"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
          {/* Status & Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100/70 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              <Tag size={12} />
              {person.sourceTraditions.join(', ')}
            </span>
            {person.importance !== 'normal' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100/70 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                ★ {person.importance === 'crucial' ? '非常重要' : '重要人物'}
              </span>
            )}
          </div>

          {/* Source cell coordinate */}
          {person.sourceCells.length > 0 && (
            <div>
              <div className="text-xs text-text-secondary mb-1 flex items-center gap-1 font-semibold">
                <MapPin size={13} /> 原稿座標
              </div>
              <div className="text-xs font-mono bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded inline-block text-text-primary">
                {person.sourceCells.join(', ')}
              </div>
            </div>
          )}

          {/* Scripture references */}
          {person.scriptureRefs.length > 0 && (
            <div>
              <div className="text-xs text-text-secondary mb-1.5 flex items-center gap-1 font-semibold">
                <BookOpen size={13} /> 經文佐證
              </div>
              <ul className="list-disc pl-5 text-text-primary space-y-1 text-xs">
                {person.scriptureRefs.map((ref, idx) => (
                  <li key={idx}>{ref}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Original Notes Mockup */}
          {person.id === 'methuselah' && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-lg text-xs leading-relaxed text-text-primary">
              <strong className="text-amber-700 dark:text-amber-400 block mb-1">【原稿 Excel 註解 Z38】</strong>
              聖經裡活的最久的人 969 歲 (創 5:27)
            </div>
          )}
          
          {person.id === 'abel' && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-lg text-xs leading-relaxed text-text-primary">
              <strong className="text-amber-700 dark:text-amber-400 block mb-1">【原稿 Excel 註解 U16】</strong>
              被該隱所殺 (創 4:8)
            </div>
          )}

          {person.hasSubtreeView && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-700 dark:text-blue-300">
              💡 此人物在原稿中設有<strong>詳細分支家譜</strong>超連結。在後續階段可展開獨立分頁視圖。
            </div>
          )}
        </div>
      </div>
    </>
  );
}
