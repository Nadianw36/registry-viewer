import type { FilterElem } from 'custom-types';
import type { Dispatch, SetStateAction } from 'react';

import { capitalizeFirstLetter } from '@util/client';

import {
  Checkbox,
  Form,
  FormGroup,
  SearchInput,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { useState, useEffect } from 'react';

export interface DevfileFilterProps {
  tagsStateWithFreq: FilterElem[];
  typesStateWithFreq: FilterElem[];
  setTagsStateWithFreq: Dispatch<SetStateAction<FilterElem[]>>;
  setTypesStateWithFreq: Dispatch<SetStateAction<FilterElem[]>>;
}

/**
 * Renders a {@link DevfileFilter} React component.
 * Adds a type and tag filter for devfiles
 * @returns `<DevfileFilter tagsStateWithFreq={tagsStateWithFreq} typesStateWithFreq={typesStateWithFreq} setTagsStateWithFreq={setTagsStateWithFreq} setTypesStateWithFreq={setTypesStateWithFreq}/>`
 */
const DevfileFilter: React.FC<DevfileFilterProps> = ({
  tagsStateWithFreq,
  typesStateWithFreq,
  setTagsStateWithFreq,
  setTypesStateWithFreq
}: DevfileFilterProps) => {
  const [tagSearchBarValue, setTagSearchBarValue] = useState('');

  useEffect(() => {
    setTagsStateWithFreq(sortFilterDataArr(tagsStateWithFreq));
  }, [tagsStateWithFreq]);

  const onCheckboxTagsChange = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const target: EventTarget = event.target;
    const state: boolean = (target as HTMLInputElement).checked;
    const value: string = (target as HTMLInputElement).name;

    const index: number = tagsStateWithFreq.findIndex((elem) => elem.value === value);

    const copy: FilterElem[] = [...tagsStateWithFreq];
    copy[index].state = state;
    setTagsStateWithFreq(copy);
  };

  const onCheckboxTypesChange = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const target: EventTarget = event.target;
    const state: boolean = (target as HTMLInputElement).checked;
    const value: string = (target as HTMLInputElement).name;

    const index: number = typesStateWithFreq.findIndex((elem) => elem.value === value);

    const copy: FilterElem[] = [...typesStateWithFreq];
    copy[index].state = state;
    setTypesStateWithFreq(copy);
  };

  const onSearchChange = (value: string) => {
    setTagSearchBarValue(value);
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2}>Filters</Text>
      </TextContent>
      <Form isHorizontal>
        {typesStateWithFreq.length > 1 && (
          <FormGroup fieldId="type-selector" label="Types" hasNoPaddingTop>
            {typesStateWithFreq.map((type) => (
              <div key={type.value} style={{ margin: '0.5rem 0rem' }}>
                <Checkbox
                  data-test-id={`type-${type.value.replace(/\.| /g, '')}`}
                  isChecked={type.state}
                  onChange={onCheckboxTypesChange}
                  id={`types-${type.value}`}
                  label={capitalizeFirstLetter(type.value)}
                  name={type.value}
                />
              </div>
            ))}
          </FormGroup>
        )}
        {tagsStateWithFreq.length > 1 && (
          <FormGroup fieldId="tag-selector" label="Tags" hasNoPaddingTop>
            {tagsStateWithFreq.length > 1 && (
              <SearchInput
                data-test-id="search-bar-tag"
                placeholder="Find by tag name"
                value={tagSearchBarValue}
                onChange={onSearchChange}
                onClear={() => onSearchChange('')}
                resultsCount={getFilterResultCount(tagsStateWithFreq, tagSearchBarValue)}
              />
            )}
            <div style={{ height: '20rem', overflow: 'auto' }}>
              {tagsStateWithFreq
                .filter((tag) => tag.value.toLowerCase().includes(tagSearchBarValue.toLowerCase()))
                .map((tag) => (
                  <div key={tag.value} style={{ margin: '0.5rem 0rem' }}>
                    <Checkbox
                      data-test-id={`tag-${tag.value.replace(/\.| /g, '')}`}
                      isChecked={tag.state}
                      onChange={onCheckboxTagsChange}
                      id={`types-${tag.value}`}
                      label={tag.value}
                      name={tag.value}
                    />
                  </div>
                ))}
            </div>
          </FormGroup>
        )}
      </Form>
    </>
  );
};

const sortFilterDataArr = (tagsStateWithFreq: FilterElem[]): FilterElem[] => {
  const copy: FilterElem[] = tagsStateWithFreq.sort((a, b) => {
    if (a.state === b.state) {
      return a.value.localeCompare(b.value, 'en', { sensitivity: 'accent' });
    }

    if (a.state && !b.state) {
      return -1;
    }

    return 1;
  });

  return copy;
};

const getFilterResultCount = (filterElemArr: FilterElem[], searchBarValue: string) =>
  filterElemArr.filter((filterElem) =>
    filterElem.value.toLowerCase().includes(searchBarValue.toLowerCase())
  ).length;

export default DevfileFilter;
