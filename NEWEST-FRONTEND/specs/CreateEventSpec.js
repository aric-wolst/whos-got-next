export default function(spec) {
    spec.describe('Posting an Event without filling in dropdowns', function() {
        spec.it('first test', async function() {
            await spec.fillIn('NameInput', 'event name test 1');
            await spec.fillIn('DescriptionInput', 'event description test 1');
            await spec.press('PostButton');
            await spec.pause(3000);
        });
    });

    // spec.describe('Posting an Event and filling in dropdowns', function() {
    //     spec.it('second test', async function() {
    //         await spec.fillIn('NameInput', 'event name test 2');
    //         await spec.fillIn('DescriptionInput', 'event description test 2');
    //         await spec.fillIn('TimeInput', '1 hour');
    //         await spec.fillIn('SportInput', 'Baseball');
    //         await spec.press('PostButton');
    //         await spec.pause(3000);
    //     });
    // });
}