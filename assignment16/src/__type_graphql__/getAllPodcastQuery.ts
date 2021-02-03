/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllPodcastQuery
// ====================================================

export interface getAllPodcastQuery_getAllPodcasts_podcasts {
  __typename: "Podcast";
  id: number;
  title: string;
  category: string;
  thumbnailUrl: string | null;
  description: string | null;
  rating: number;
}

export interface getAllPodcastQuery_getAllPodcasts {
  __typename: "GetAllPodcastsOutput";
  ok: boolean;
  error: string | null;
  podcasts: getAllPodcastQuery_getAllPodcasts_podcasts[] | null;
}

export interface getAllPodcastQuery {
  getAllPodcasts: getAllPodcastQuery_getAllPodcasts;
}
