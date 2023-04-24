import { Box } from "@mui/material";
import dayjs from 'dayjs';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { ZetkinEvent } from "utils/types/zetkin";
import theme from 'theme';
import EventWarningIcons from "features/events/components/EventWarningIcons";
import EventDataModel from 'features/events/models/EventDataModel';
import {
    EmojiPeople,
    FaceRetouchingOff,
    MailOutline,
  } from '@mui/icons-material';

export enum STATUS_COLORS {
    BLUE = 'blue',
    GREEN = 'green',
    GRAY = 'gray',
    ORANGE = 'orange',
    RED = 'red',
}

const CalendarDayViewActivity = ({
    event,
    statusColor = STATUS_COLORS.GREEN
}: {
    event: ZetkinEvent
    statusColor: STATUS_COLORS
}) => {
    return <>
        <Box style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                backgroundColor: "white",
                border: "1px secondary solid",
                padding: "1em",
                flexWrap: "wrap"
            }}
            // TODO: On Click open event popper
            >
            <Box style={{
                display: "flex",
                gap: "1em"
            }}>
                <Box style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <div style={{
                        backgroundColor: theme.palette.statusColors[statusColor],
                        width: "10px",
                        height: "10px",
                        borderRadius: "100%"
                    }}></div>
                </Box>
                
                <Box style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "1em"
                }}>
                    <Box display="flex" gap="0.1em">
                        <span style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                
                            }}>
                            <EventIcon />
                        </span>
                        <span>{event.title || event.activity.title}</span>
                    </Box>
                    <Box style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.1em",
                        color: theme.palette.text.secondary
                    }}>
                        <ScheduleIcon />
                        <Box>
                            <span>{ dayjs(event.start_time).format("HH:mm") }</span>
                            {event.end_time && (
                                <span> - { dayjs(event.end_time).format("HH:mm") }</span>
                            )}
                        </Box>
                    </Box>
                    <Box style={{
                        display: "flex",
                        alignItems: "center",
                        color: theme.palette.text.secondary,
                        gap: "0.1em"
                    }}>
                        <PlaceOutlinedIcon />
                        <span>{ event.location.title }</span>
                    </Box>
                </Box>
            </Box>
            <Box style={{
                        display: "flex",
                        alignItems: "center",
                        color: "secondary",
                        gap: "1em"
                    }}>
                {/* <EventWarningIcons/> */}
                {/* TODO: Pass in data to EventWarningIcons component */}
                <Box display="flex">
                    <EmojiPeople color="error" />
                    <FaceRetouchingOff color="error"  />
                    <MailOutline color="error" />
                </Box>
                <Box style={{
                    display: "flex",
                    gap: "0.5em",
                    alignItems: "center"
                }}>
                    <PeopleIcon />
                    <span>{event.num_participants_available}/{event.num_participants_required}</span>
                </Box>
                
            </Box>

        </Box>
    </>
}

export default CalendarDayViewActivity;