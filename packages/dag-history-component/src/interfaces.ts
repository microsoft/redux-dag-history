import { StateId } from '@essex/redux-dag-history/lib/interfaces';

export interface IBookmark {
  stateId: StateId;
  name: string;
  data: { [name: string]: any };
}
