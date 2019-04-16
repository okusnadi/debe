import { addToQuery, Debe, IItem, IGetItem } from 'debe';
import { ISocketBase } from 'asyngular-client';
import {
  ICountInitialChanges,
  IInitialFetchChanges,
  batchSize,
  ISendChanges
} from 'debe-sync';
import { DebeBackend } from 'debe-adapter';

export async function createSocketChannels(client: Debe, socket: ISocketBase) {
  const collections = (client.dispatcher as DebeBackend).collections;

  // Get a count of all items that need to be synced with client
  (async () => {
    for await (let req of socket.procedure<ICountInitialChanges, number>(
      'countInitialChanges'
    )) {
      let { type, since, where } = req.data;
      const collection = collections[type];
      if (since) {
        where = addToQuery(
          where,
          'AND',
          `${collection.specialFields.rev} > ?`,
          since
        );
      }
      try {
        const count = await client.count(type, { where });
        req.end(count);
      } catch (err) {
        req.error(err);
      }
    }
  })();

  // Fetch all changes and send back
  (async () => {
    for await (let req of socket.procedure<
      IInitialFetchChanges,
      (IItem & IGetItem)[]
    >('initialFetchChanges')) {
      let { type, since, where, page = 0 } = req.data;
      const collection = collections[type];
      if (since) {
        where = addToQuery(
          where,
          'AND',
          `${collection.specialFields.rev} > ?`,
          since
        );
      }
      try {
        const result = await client.all(type, {
          where,
          orderBy: ['rev ASC', 'id ASC'],
          limit: batchSize,
          offset: page * batchSize
        });
        req.end(result);
      } catch (err) {
        req.error(err);
      }
    }
  })();

  // Receive changes
  (async () => {
    for await (let req of socket.procedure<ISendChanges>('sendChanges')) {
      let [type, items] = req.data;
      const collection = collections[type];
      const newItems = await client
        .insert(collection.name, items, { synced: socket.id } as any)
        .catch(x => console.error('Error while client.insert', x) as any);
      req.end(newItems.length ? newItems[newItems.length - 1].rev : undefined);
    }
  })();
}
