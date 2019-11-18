export default function(spec) {

    spec.describe('Posting an Event without filling in dropdowns', function() {

        spec.it('first test', async function() {
            // Fill in the Event Name
            await spec.fillIn('NameInput', 'Fail');

            // Fill in the Event Description
            await spec.fillIn('DescriptionInput', 'This test tries to post an event without filling in the Time and Sport dropdown menus.');

            // Try to submit without picking a duration and sport
            await spec.pause(2000);
            await spec.press('PostButton');
            await spec.pause(3000);

            // This is the test oracle = when a user tries to click the Post Event button ('PostButton')
            // but has not given all of the required information, then the 'PostButton' should continue to exist.
            // Note that if all required info is given, then the 'PostButton' would be disabled and turned to
            // the 'DisabledButton'.
            await spec.exists('PostButton');
            await spec.notExists('DisabledButton');
        });

    });

    spec.describe('Posting an Event and filling in dropdowns', function() {
        spec.it('second test', async function() {
            // Fill in the Event Name
            await spec.fillIn('NameInput', 'Pass');

            // Fill in the Event Description
            await spec.fillIn('DescriptionInput', 'This test tries to post a valid event, and see if it indeed was successful.');

            // Fill in the Duration dropdown
            await spec.fillIn('TimeInput', '3 hours');

            // Fill in the Sport dropdown
            await spec.fillIn('SportInput', 'Cricket');


            // Try to post the event after filling in all of the required information
            await spec.pause(2000);
            await spec.press('PostButton');
            await spec.pause(3000);

            // This is the test oracle = when a user has filled in all of the required fields on the form 
            // and hits the Post Event button ('PostButton'), it should do a backend request to create a new
            // Event in the database and then the 'PostButton' will be disabled and turned into the 
            // 'DisabledButton'. We make sure this behaviour is indeed followed by executing the next two
            // statements
            await spec.exists('DisabledButton');
            await spec.notExists('PostButton');
        });
    });
}
