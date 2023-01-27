import {
  DashboardState,
  LAST_STEP_N,
  STATE_TO_LABEL,
  STATE_TO_STEP_N,
} from '../../store/dashboard';
import { DiscreteProgressBar } from './DiscreteProgressbar';
import css from './DashboardComponent.module.css';

export function StateWrapper({
  state,
  nextBtn,
  children,
}: {
  state: DashboardState;
  nextBtn?: any;
  children: any;
}) {
  return (
    <>
      <div className="flex flex-col justify-center flex-grow gap-y-4">
        <div className="shadow-md bg-slate-200 p-8 rounded-md flex justify-between items-center">
          <div className="py-2">
            <DiscreteProgressBar
              currStep={STATE_TO_STEP_N[state.currState] + 1}
              maxStep={LAST_STEP_N + 1}
              stepLabel={STATE_TO_LABEL[state.currState]}
            ></DiscreteProgressBar>
          </div>
          {nextBtn && <div>{nextBtn}</div>}
        </div>
        <div
          className={`shadow-md bg-slate-200 p-8 rounded-md grow grid place-items-center overflow-y-auto ${css.scrollbar}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export function ActionButton({
  label,
  onClick,
  isLoading,
}: {
  label: string;
  onClick?: any;
  isLoading?: boolean;
}) {
  return (
    <button
      className={`py-2.5 px-5 text-sm font-medium text-white focus:outline-none rounded-md border-gray-600 select-none ${
        isLoading
          ? 'cursor-progress bg-gray-400 hover:bg-gray-400'
          : 'bg-blue-600 hover:bg-blue-700 hover:text-gray-200 '
      }`}
      disabled={isLoading ?? false}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
