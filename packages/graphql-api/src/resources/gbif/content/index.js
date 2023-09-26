import contentAPI from './content.source';
import resolver from './content.resolver';
import dataUse from './dataUse.type';
import event from './event.type';
import news from './news.type';
import notification from './notification.type';
import shared from './shared.type';
import contentSearch from './contentSearch.type';

export default {
  resolver,
  typeDef: [contentSearch, dataUse, event, news, notification, shared],
  dataSource: {
    contentAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
