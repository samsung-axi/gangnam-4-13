import { css } from 'styled-components';

export const media = {
    mobile: (...args) => css`
    @media (max-width: 480px) {
      ${css(...args)}
    }
  `,
    tablet: (...args) => css`
    @media (max-width: 768px) {
      ${css(...args)}
    }
  `,
    laptop: (...args) => css`
    @media (max-width: 1024px) {
      ${css(...args)}
    }
  `,
};