import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import HistoryPresenter from './HistoryPresenter';
import VisualA from './visuals/VisualA';
import VisualB from './visuals/VisualB';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


export interface ApplicationProps {
  store: any;
}

export interface ApplicationState {
}

@DragDropContext(HTML5Backend)
export default class Application extends React.Component<ApplicationProps, ApplicationState> {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div className="app-container">
          <div className="dashboard">
            <div className="visual-pane">
              <VisualA />
              <VisualB />
            </div>
            <div className="history-pane">
              <HistoryPresenter />
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}
