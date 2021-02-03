import { gql } from '@apollo/client';

export const PODCAST_FRAGMENT = gql`
  fragment PodcastParts on Podcast {
    id
    title
    category
    thumbnailUrl
    description
    rating
  }
`;
