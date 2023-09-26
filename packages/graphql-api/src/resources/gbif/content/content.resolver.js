import { getHtml } from "#/helpers/utils";

// the truncation and excerpt code doesn't eally belong here, but it is a quick copy of the TS version to have it all together for easier comparison
function truncateText(sourceText, maxLength) {
  if (sourceText.length <= maxLength) return sourceText;
  const truncatedText = sourceText.slice(0, maxLength);
  const lastSpaceIndex = truncatedText.lastIndexOf(' ');
  return truncatedText.slice(0, lastSpaceIndex) + '...';
}

function getExcerpt({ summary, body }, maxLength = 200) {
  if (summary != null) return getHtml(summary);// this ought to strip tags, but is kept as is to behave like the other implementation
  if (body == null) return;

  // Parse the body and remove all tags
  const bodyHtml = getHtml(body, { inline: true, allowedTags: [] });
  return truncateText(bodyHtml, maxLength);
}

// we need to parse some of the fields as HTML, and since it is the same for many of them we have it as a shared resolver.
const sharedResolvers = {
  title: (src) => getHtml(src.title, { inline: true }),
  summary: (src) => getHtml(src.summary, { inline: true }),
  body: (src) => getHtml(src.body),
  excerpt: (src) => getExcerpt(src),
};

export default {
  Query: {
    resourceSearch: (parent, { input }, { language, dataSources }) =>
      dataSources.contentAPI.searchContentDocuments({ query: input, language }),
    dataUse: (parent, { id, preview }, { language, dataSources }) =>
      dataSources.contentAPI.getContentByKey({ key: id, preview, language }),
    news: (parent, { id, preview }, { language, dataSources }) =>
      dataSources.contentAPI.getContentByKey({ key: id, preview, language }),
    event: (parent, { id, preview }, { language, dataSources }) =>
      dataSources.contentAPI.getContentByKey({ key: id, preview, language }),
    notification: (parent, { id, preview }, { language, dataSources }) =>
      dataSources.contentAPI.getContentByKey({ key: id, preview, language }),
  },
  ContentSearchResult: {
    count: ({ total }) => total,
    offset: ({ from }) => from,
    limit: ({ size }) => size,
    endOfRecords: ({ total, size, from }) => from + size >= total,
  },
  SingleSearchResult: {
    __resolveType(obj) {
      // Map the content types from ElasticSearch to the GraphQL types
      switch (obj.contentType) {
        case 'dataUse': return 'DataUse';
        case 'event': return 'Event';
        case 'news': return 'News';
        case 'notification': return 'Notification';
      }
      return null; // GraphQLError is thrown - do this if nothing is matched and you have missed a mapping.
    }
  },
  DataUse: {
    ...sharedResolvers
  },
  Event: {
    ...sharedResolvers
  },
  News: {
    ...sharedResolvers
  },
};
