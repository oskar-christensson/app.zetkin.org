import { FormattedMessage as Msg } from 'react-intl';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Box,
  Button,
  lighten,
  makeStyles,
  TextareaAutosize,
  Typography,
} from '@material-ui/core';
import { Edit, Save } from '@material-ui/icons';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import { journeyInstanceResource } from 'api/journeys';
import { ZetkinJourneyInstance } from 'types/zetkin';

const useStyles = makeStyles((theme) => ({
  collapsed: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  editSummary: {
    border: '2px dotted transparent',
    borderColor: lighten(theme.palette.primary.main, 0.65),
    borderRadius: 10,
    fontFamily: theme.typography.fontFamily,
    lineHeight: '1.5',
    overflow: 'hidden',
    padding: 10,
    resize: 'none',
    width: '100%',
  },
  expanded: {},
}));

const JourneyInstanceSummary = ({
  journeyInstance,
}: {
  journeyInstance: ZetkinJourneyInstance;
}): JSX.Element => {
  const classes = useStyles();
  const { orgId } = useRouter().query;

  const [summaryCollapsed, setSummaryCollapsed] = useState<boolean>(true);

  const [editingSummary, setEditingSummary] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>(journeyInstance.summary);

  const journeyInstanceHooks = journeyInstanceResource(
    orgId as string,
    journeyInstance.journey.id.toString(),
    journeyInstance.id.toString()
  );
  const patchJourneyInstanceMutation = journeyInstanceHooks.useUpdate();

  const saveEditedSummary = (summary: string) => {
    patchJourneyInstanceMutation.mutateAsync(
      { summary },
      {
        onSuccess: () => setEditingSummary(false),
      }
    );
  };

  return (
    <>
      <Box
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">
          <Msg id="pages.organizeJourneyInstance.summaryHeader" />
        </Typography>
        <Button
          color="primary"
          onClick={
            editingSummary
              ? () => {
                  setEditingSummary(false);
                  saveEditedSummary(summary);
                }
              : () => setEditingSummary(true)
          }
          startIcon={editingSummary ? <Save /> : <Edit />}
          style={{ textTransform: 'uppercase' }}
        >
          <Msg
            id={
              editingSummary
                ? 'pages.organizeJourneyInstance.saveButton'
                : 'pages.organizeJourneyInstance.editButton'
            }
          />
        </Button>
      </Box>
      {editingSummary ? (
        <TextareaAutosize
          className={classes.editSummary}
          onChange={(e) => setSummary(e.target.value)}
          value={summary}
        />
      ) : (
        <>
          <Typography
            className={summaryCollapsed ? classes.collapsed : classes.expanded}
            variant="body1"
          >
            {journeyInstance.summary}
          </Typography>
          {journeyInstance.summary.length > 100 && (
            <Button
              color="primary"
              onClick={() => setSummaryCollapsed((prev) => !prev)}
              startIcon={summaryCollapsed ? <ExpandMore /> : <ExpandLess />}
              style={{ textTransform: 'uppercase' }}
            >
              <Msg
                id={
                  summaryCollapsed
                    ? 'pages.organizeJourneyInstance.expandButton'
                    : 'pages.organizeJourneyInstance.collapseButton'
                }
              />
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default JourneyInstanceSummary;
