/********************************************************
Copyright (c) 2022 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*********************************************************
 * 
 * Macro Author:      	William Mills
 *                    	Technical Solutions Specialist 
 *                    	wimills@cisco.com
 *                    	Cisco Systems
 * 
 * Version: 1-0-0
 * Released: 01/17/22
 * 
 * This is a simple Webex Device macro which displays an alert when
 * specific bookings are about to end.
 * 
 * Modify the Alert Tile and Text below. Also specify the meeting
 * organiser name you wish macro to check for.
 * 
 * Find out more information on our github:
 * https://github.com/wxsd-sales/booking-end-alert-macro
 * 
 ********************************************************/

import xapi from 'xapi';

const config = {
  endingAlert: {
    Duration: 60,  // How long you want the alert to appear in seconds
    Title: 'Room Reservation Ending',
    Text: [
      'This reservation is about to end in',  // number of minutes will appended to the frist list
      'Please book additional time or exit the room. Thank you'
    ]
  },
  endedAlert: {
    Duration: 20,
    Title: 'Room Reservation Ended',
    Text: [
      'This reservation has ended',
      'Please book additional time or exit the room. Thank you'
    ]
  },
  organizer: 'William Mills', //The organizer full name
  seconds: [    // Booking Ending Trigger alerts at 600/300/... second intervals, check which you want to monitor
    //900,
    600,
    300
    //60
  ]
}


xapi.Event.Bookings.TimeRemaining.on(processTimeRemaining);
xapi.Event.Bookings.End.on(processEnded);

async function processTimeRemaining(event) {
  console.log(`Time Remaining Event. Booking: [${event.Id}] - Remaining: [${event.Seconds}] seconds`)
  if (!checkRemainingSeconds(event.Seconds)) {
    console.log('Number of seconds remaining not configured for alerts, ignoring event')
    return;
  }
  const booking = await getBooking(event.Id)

  if (booking == null) {
    console.log(`Booking [${event.Id}] dooesn't contain correct organizer, ignoring event`)
    return;
  }
  console.log('Constructing message')
  let alert = config.endingAlert;
  const minutes = event.Seconds / 60;
  alert.Text = `${alert.Text[0]} ${minutes} minute${minutes == 1 ? '' : 's'}. ${alert.Text[1]}`;
  displayAlert(alert);
}

async function processEnded(event) {
  console.log(`Booking End Event. Booking: [${event.Id}]`)
  const booking = await getBooking(event.Id)
  if (booking == null) {
    console.log(`Booking [${event.Id}] dooesn't contain correct organizer, ignoring event`)
    return;
  }
  console.log('Constructing message')
  let alert = config.endedAlert;
  alert.Text = `${alert.Text[0]}. ${alert.Text[1]}`;
  displayAlert(alert);
}

function checkRemainingSeconds(remaining) {
  return config.seconds.includes(parseInt(remaining))
}

function displayAlert(alert) {
  console.log(`Display alert - Title: ${alert.Title}, Text: ${alert.Text}, Duration: ${alert.Duration}`)
  xapi.Command.UserInterface.Message.Alert.Display(alert);
}

function checkOrganizer(booking) {
  console.log(`Booking Organizer: [${booking?.Organizer?.FirstName}] - checking against [${config.organizer}]`)
  if (booking?.Organizer?.FirstName == undefined) return false;
  return booking.Organizer.FirstName === config.organizer
}

function getBooking(id) {
  return xapi.Command.Bookings.Get({ Id: id })
    .then(result => {
      if (checkOrganizer(result.Booking)) return result.Booking;
      return null;
    })
    .catch(e => {
      console.error('Error: ' + e.message);
      return null;
    })
}
