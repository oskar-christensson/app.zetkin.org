import Fuse from 'fuse.js';
import { lighten } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Add, Clear } from '@mui/icons-material';
import { Autocomplete, Box, TextField, Theme, Tooltip } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import EventTypesModel from '../models/EventTypesModel';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinActivity, ZetkinEvent } from 'utils/types/zetkin';

interface StyleProps {
  showBorder: boolean | undefined;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  inputRoot: {
    '& fieldset': { border: 'none' },
    '&:focus, &:hover': {
      borderColor: lighten(theme.palette.primary.main, 0.65),
      paddingLeft: 10,
      paddingRight: 0,
    },
    border: '2px dotted transparent',
    borderColor: ({ showBorder }) =>
      showBorder ? lighten(theme.palette.primary.main, 0.65) : '',
    borderRadius: 10,
    maxWidth: '200px',
    paddingLeft: ({ showBorder }) => (showBorder ? 10 : 0),
    transition: 'all 0.2s ease',
  },
}));

type EventTypeAutocompleteProps = {
  onBlur: () => void;
  onChange: (newValue: ZetkinEvent['activity'] | null) => void;
  onChangeNewOption: (newId: number) => void;
  onFocus: () => void;
  showBorder?: boolean;
  types: ZetkinActivity[];
  typesModel: EventTypesModel;
  value: ZetkinEvent['activity'];
};

interface EventTypeOption {
  id: number | 'CREATE' | 'UNCATEGORIZED';
  title: string;
}

const EventTypeAutocomplete: FC<EventTypeAutocompleteProps> = ({
  onBlur,
  onChange,
  onChangeNewOption,
  onFocus,
  showBorder,
  types,
  typesModel,
  value,
}) => {
  const [createdType, setCreatedType] = useState<string>('');

  const classes = useStyles({ showBorder });
  const messages = useMessages(messageIds);

  useEffect(() => {
    //When a user creates a new type, it is missing an event ID.
    //In here, when the length of the type changes,
    //it searches for the created event and updates event with an ID.
    if (createdType !== '') {
      const newId = types.find((item) => item.title === createdType)!.id;
      onChangeNewOption(newId!);
    }
  }, [types.length]);

  const allTypes: EventTypeOption[] = [
    ...types,
    {
      id: 'UNCATEGORIZED',
      title: messages.type.uncategorized(),
    },
  ];

  const fuse = new Fuse(types, {
    keys: ['title'],
    threshold: 0.4,
  });

  return (
    <Tooltip arrow title={showBorder ? '' : messages.type.tooltip()}>
      <Autocomplete
        blurOnSelect
        classes={{
          root: classes.inputRoot,
        }}
        disableClearable
        filterOptions={(options, { inputValue }) => {
          const searchedResults = fuse.search(inputValue);
          const inputStartWithCapital = inputValue
            ? `${inputValue[0].toUpperCase()}${inputValue.substring(
                1,
                inputValue.length
              )}`
            : '';

          const filteredResult: EventTypeOption[] = [
            ...searchedResults.map((result) => {
              return { id: result.item.id, title: result.item.title };
            }),
            {
              id: 'UNCATEGORIZED',
              title: messages.type.uncategorized(),
            },
          ];
          if (
            filteredResult.find(
              (item) =>
                item.title?.toLocaleLowerCase() ===
                inputValue.toLocaleLowerCase()
            )
          ) {
            return filteredResult;
          }

          filteredResult.push({
            id: 'CREATE',
            title: inputStartWithCapital,
          });
          return inputValue ? filteredResult : options;
        }}
        fullWidth
        getOptionLabel={(option) => option.title!}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        onBlur={() => onBlur()}
        onChange={(_, value) => {
          if (value.id == 'CREATE') {
            typesModel.addType(value.title!);
            setCreatedType(value.title!);
            return;
          }
          onChange(
            value.id == 'UNCATEGORIZED'
              ? null
              : {
                  id: value.id,
                  title: value.title!,
                }
          );
        }}
        onFocus={() => onFocus()}
        options={allTypes}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              shrink: false,
              style: {
                maxWidth: 180,
              },
            }}
            InputProps={{
              ...params.InputProps,
            }}
            size="small"
          />
        )}
        renderOption={(props, option) => {
          return (
            <Box key={option.id}>
              {option.id != 'CREATE' && option.id != 'UNCATEGORIZED' && (
                <li {...props}>{option.title}</li>
              )}
              {option.id == 'UNCATEGORIZED' && (
                <li {...props}>
                  <Clear />
                  {messages.type.uncategorized()}
                </li>
              )}
              {option.id == 'CREATE' && (
                <li {...props}>
                  <Add />
                  {messages.type.createType({ type: option.title! })}
                </li>
              )}
            </Box>
          );
        }}
        value={
          value
            ? value
            : {
                id: 'UNCATEGORIZED',
                title: messages.type.uncategorized(),
              }
        }
      />
    </Tooltip>
  );
};

export default EventTypeAutocomplete;
