export default function(spec) {
    spec.describe('Updating Profile without filling in all required fields', function() {
        spec.it('third test', async function() {
            await spec.fillIn('NameInput', 'Fail');
            await spec.fillIn('DescriptionInput', 'This test tries to update a profile without specifying a gender.');

            await spec.pause(2000);
            await spec.press('PostButton');
            await spec.pause(3000);
            await spec.exists('PostButton');
            await spec.notExists('DisabledButton');
        });
    });

    spec.describe('Updating Profile and properly filling in all required fields', function() {
        spec.it('fourth test', async function() {
            await spec.fillIn('GenderInput', 'Male');
            await spec.fillIn('NameInput', 'Victor');
            await spec.fillIn('DescriptionInput', 'This test tries to update a profile properly.');
            await spec.fillIn('BasketballLevelInput', 'Expert');
            await spec.press('BasketballButton');

            await spec.pause(2000);
            await spec.press('PostButton');
            await spec.pause(3000);

            await spec.exists('DisabledButton');
            await spec.notExists('PostButton');
        });
    });
}