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
      <div className="flex flex-col justify-center flex-grow gap-y-2">
        <div className="shadow-md bg-spark-purple-300 p-4 rounded-md flex justify-between items-center">
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
          className={`shadow-md bg-spark-purple-50 px-4 py-2 xl:px-8 xl:py-4 rounded-md grow grid place-items-center overflow-y-auto ${css.scrollbar}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
