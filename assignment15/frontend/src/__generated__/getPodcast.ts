/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PodcastSearchInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPodcast
// ====================================================

export interface getPodcast_getPodcast_podcast_episodes {
  __typename: "Episode";
  id: number;
  createdAt: any;
  updatedAt: any;
  title: string;
  category: string;
}

export interface getPodcast_getPodcast_podcast {
  __typename: "Podcast";
  id: number;
  createdAt: any;
  updatedAt: any;
  title: string;
  category: string;
  rating: number;
  episodes: getPodcast_getPodcast_podcast_episodes[];
}

export interface getPodcast_getPodcast {
  __typename: "PodcastOutput";
  ok: boolean;
  error: string | null;
  podcast: getPodcast_getPodcast_podcast | null;
}

export interface getPodcast {
  getPodcast: getPodcast_getPodcast;
}

export interface getPodcastVariables {
  input: PodcastSearchInput;
}
