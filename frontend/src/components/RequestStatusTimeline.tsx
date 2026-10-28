import React from 'react';
import { BloodRequest, RequestStatus } from '../types';
import { REQUEST_STEPS, getStepIndex } from '../utils/bloodCompatibility';
import { Check, Clock, AlertCircle, XCircle } from 'lucide-react';

interface RequestStatusTimelineProps {
  request: BloodRequest;
  onUpdateStatus?: (status: RequestStatus) => void;
  isInteractive?: boolean;
}

export const RequestStatusTimeline: React.FC<RequestStatusTimelineProps> = ({
  request,
  onUpdateStatus,
  isInteractive = false
}) => {
  const currentStepIdx = getStepIndex(request.status);
  const isCancelled = request.status === 'cancelled';

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Emergency Response Timeline
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of donor discovery and hospital coordination
          </p>
        </div>
        <div>
          {isCancelled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              <XCircle className="w-3.5 h-3.5 text-slate-500" />
              Request Cancelled
            </span>
          ) : request.status === 'fulfilled' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Fulfilled Successfully
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              In Progress
            </span>
          )}
        </div>
      </div>

      {/* Visual Stepper Bar */}
      <div className="relative mb-8">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-red-600 to-emerald-600 -translate-y-1/2 z-0 transition-all duration-700"
          style={{ 
            width: isCancelled ? '0%' : `${(Math.max(0, currentStepIdx) / (REQUEST_STEPS.length - 1)) * 100}%` 
          }}
        ></div>

        <div className="relative z-10 flex items-center justify-between">
          {REQUEST_STEPS.map((step, idx) => {
            const isCompleted = !isCancelled && idx < currentStepIdx;
            const isCurrent = !isCancelled && idx === currentStepIdx;
            const isPending = isCancelled || idx > currentStepIdx;

            return (
              <div 
                key={step.key} 
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => isInteractive && onUpdateStatus && onUpdateStatus(step.key)}
              >
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCurrent
                      ? 'bg-red-600 text-white ring-4 ring-red-100 shadow-md scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-white text-slate-400 border-2 border-slate-200 group-hover:border-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div className="text-center mt-2 max-w-[90px] sm:max-w-[120px]">
                  <p className={`text-xs font-bold leading-tight ${
                    isCurrent ? 'text-red-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Event Log List */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
          Activity Log
        </h5>
        <div className="space-y-3">
          {request.timeline.map((event, i) => (
            <div key={i} className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{event.title}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
