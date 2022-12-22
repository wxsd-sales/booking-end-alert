# Booking End Alert Macro

This is a simple Webex Device macro which displays an alert when a booking is about to end

### How it works

The macro monitors booking end events on the Webex Device and can alert up to 10 minutes before a booking is about to end.

## Requirements

1. RoomOS/CE 9.6.x or above Webex Device.
2. Web admin access to the device to uplaod the macro.
3. Network connectivity for your Webex Device to make HTTP POSTs directly with your telemetry server.

## Setup

1. Download the ``booking-end-alert.js`` file and upload it to your Webex Room devices Macro editor via the web interface.
2. Configure the Macro by changing the initial values, there are comments explaining each one.
3. Enable the Macro on the editor.

## Validation

Validated Hardware:

* Room Kit Pro
* Desk Pro
* Desk Hub
* Room Kit

This macro should work on other Webex Devices but has not been validated at this time.

## Support

Please reach out to the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=booking-end-alert-macro)
