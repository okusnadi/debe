import { Debe, IGetItem, types, coreSkill, changeListenerSkill } from 'debe';
import { ISkill } from 'service-dog';

interface IStore {
  [s: string]: IGetItem[];
}

export const memorySkill = (Faltu: any): ISkill => {
  const store: IStore = {};
  function handle(type: string, item: any) {
    const index = item.id ? store[type].findIndex(x => x.id === item.id) : -1;
    if (index === -1) {
      store[type].push(item);
    } else {
      store[type][index] = item;
    }
    return item;
  }
  function ensureModel(model: string) {
    if (model && !store[model]) {
      store[model] = [];
    }
  }

  return function memory(type, payload, flow) {
    if (type === types.INSERT) {
      const [model, arg] = payload;
      ensureModel(model);
      flow.return(arg.map((x: any) => handle(model, x)));
    } else if (type === types.COUNT) {
      const [model] = payload;
      ensureModel(model);
      flow.return(store[model].length);
    } else if (type === types.GET) {
      const [model, arg] = payload;
      ensureModel(model);
      flow.return(store[model].find(x => x.id === arg.id));
    } else if (type === types.ALL) {
      const [model, query] = payload;
      ensureModel(model);
      if (query && query.where) {
        flow.return(new Faltu(store[model]).find(query.where).get());
      } else {
        flow.return([...store[model]]);
      }
    } else {
      flow(payload);
    }
  };
};

export class MemoryDebe extends Debe {
  constructor(faltu: any) {
    super();
    this.skill([changeListenerSkill(), coreSkill(), memorySkill(faltu)]);
    // this.tracker = x => console.log(x);
  }
}