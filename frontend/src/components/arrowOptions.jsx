/* eslint-disable no-unused-vars */
import { ArrowLeft, Clock, GitBranch, Coffee, Code, Zap, DoorOpen,Activity, Users, Crown, UserCircle2, OptionIcon } from "lucide-react";
import { ArrowUp, Armchair, Search, User, X } from 'lucide-react';
export default function ArrowOptions({ setShowArrowOptions ,handleFindChair,handleFindPerson,gameRef,showArrow,handleToggleArrow,detachPhaserKeyboard,attachPhaserKeyboard,findPersonInput,setFindPersonInput})  {
    return(<>
    <div className="absolute top-24 right-4 z-30 bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-4 w-64">
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-400 flex items-center gap-2">
                <ArrowUp className="w-4 h-4" />
                Arrow Options
              </h3>
              <button
                onClick={() => { setShowArrowOptions(false); }}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Arrow Button */}
            <button
              className={`w-full mb-3 px-3 py-2 rounded-md border transition-all duration-200 flex items-center justify-center gap-2 ${showArrow
                ? "bg-purple-600 text-white border-purple-500 hover:bg-purple-700"
                : "bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600"
                }`}
              onClick={handleToggleArrow}
            >
              {showArrow ? (
                <>
                  <div className="relative">
                    <ArrowUp className="w-4 h-4" />
                    <X className="w-2 h-2 absolute -top-1 -right-1 text-red-500" />
                  </div>
                  Hide your arrow
                </>
              ) : (
                <>
                  <ArrowUp className="w-4 h-4" />
                  Show your arrow
                </>
              )}
            </button>

            {/* Find Chair Button */}
            <button
              className="w-full mb-3 px-3 py-2 rounded-md border border-slate-600 bg-slate-700 text-gray-200 hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
              onClick={handleFindChair}
            >
              <Armchair className="w-4 h-4" />
              Find your chair
            </button>

            {/* Find Person Section */}
            <div className="space-y-2">
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full border border-slate-600 bg-slate-700 text-gray-200 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Find person by username"
                  onFocus={e => {
                    if (gameRef.current) {
                      const scene = gameRef.current.scene.getScene('OfficeMapScene');
                      detachPhaserKeyboard(scene);
                    }
                  }}
                  onBlur={e => {
                    if (gameRef.current) {
                      const scene = gameRef.current.scene.getScene('OfficeMapScene');
                      attachPhaserKeyboard(scene);
                    }
                  }}
                  value={findPersonInput}
                  onChange={e => setFindPersonInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleFindPerson()}
                />
              </div>
              <button
                className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-700 text-gray-200 hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleFindPerson}
                disabled={!findPersonInput.trim()}
              >
                <Search className="w-4 h-4" />
                Find person
              </button>
            </div>
          </div>
    </>)
}