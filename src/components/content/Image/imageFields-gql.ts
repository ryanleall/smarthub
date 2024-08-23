import { DocumentNode } from 'graphql';

import * as Types from '../../../graphql/types';

export type ImageFieldsFragment = {
  blurhash?: string | null;
  views: Array<{ height?: number | null; width?: number | null; url: string }>;
};

export const ImageFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'imageFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Image' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'blurhash' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'views' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
