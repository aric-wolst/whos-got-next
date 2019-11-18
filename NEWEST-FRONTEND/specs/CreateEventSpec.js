export default function(spec) {
    spec.describe('Posting an Event without filling in dropdowns', function() {
        spec.it('first test', async function() {
            await spec.fillIn('NameInput', 'Fail');
            await spec.fillIn('DescriptionInput', 'This test tries to post an event without filling in the Time and Sport dropdown menus.');
            await spec.press('PostButton');
            await spec.pause(3000);
            await spec.exists('PostButton');
            await spec.notExists('DisabledButton');
        });
    });

    spec.describe('Posting an Event and filling in dropdowns', function() {
        spec.it('second test', async function() {
            await spec.fillIn('NameInput', 'Pass');
            await spec.fillIn('DescriptionInput', 'This test tries to post a valid event, and see if it indeed was successful.');
            await spec.fillIn('TimeInput', '3 hours');
            await spec.fillIn('SportInput', 'Cricket');
            await spec.press('PostButton');
            await spec.pause(3000);
            await spec.exists('DisabledButton');
            await spec.notExists('PostButton');
        });
    });
}