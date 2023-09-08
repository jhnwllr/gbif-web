import { z } from "zod";
import { News } from "../../contentTypes/news";
import { ContentfulReferenceSchema, DataMapper, createContentfulMapper } from "./_shared";

export const contentfulNewsMapper: DataMapper<News> = createContentfulMapper({
    contentType: 'News',
    fields: z.object({
        title: z.string(),
        summary: z.string().optional(),
        body: z.string().optional(),
        primaryImage: ContentfulReferenceSchema.optional(),
        primaryLink: ContentfulReferenceSchema.optional(),
        secondaryLinks: z.array(ContentfulReferenceSchema).optional(),
        citation: z.string().optional(),
        countriesOfCoverage: z.array(ContentfulReferenceSchema).optional(),
        topics: z.array(ContentfulReferenceSchema).optional(),
        purposes: z.array(ContentfulReferenceSchema).optional(),
        audiences: z.array(ContentfulReferenceSchema).optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean(),
        homepage: z.boolean()
    }),
    map: dto => ({
        contentType: 'news',
        id: dto.sys.id,
        title: dto.fields.title,
        summary: dto.fields.summary,
        body: dto.fields.body,
        primaryImage: dto.fields.primaryImage?.sys.id != null ? { id: dto.fields.primaryImage.sys.id } : undefined,
        primaryLink: dto.fields.primaryLink?.sys.id != null ? { id: dto.fields.primaryLink.sys.id } : undefined,
        secondaryLinks: dto.fields.secondaryLinks?.map(l => ({ id: l.sys.id })) ?? [],
        citation: dto.fields.citation,
        countriesOfCoverage: dto.fields.countriesOfCoverage?.map(c => c.sys.id) ?? [],
        topics: dto.fields.topics?.map(t => ({ id: t.sys.id })) ?? [],
        purposes: dto.fields.purposes?.map(p => ({ id: p.sys.id })) ?? [],
        audiences: dto.fields.audiences?.map(a => ({ id: a.sys.id })) ?? [],
        keywords: dto.fields.keywords ?? [],
        searchable: dto.fields.searchable,
        homepage: dto.fields.homepage,
    })
})