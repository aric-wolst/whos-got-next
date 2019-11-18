export default function(spec) {

    
    spec.describe('Updating Profile without filling in all required fields', function() {
        spec.it('third test', async function() {

            // Fill in the user's name
            await spec.fillIn('NameInput', 'Fail');

            // Fill in the user's bio
            await spec.fillIn('DescriptionInput', 'This test tries to update a profile without specifying a gender.');

            // Try to hit the Update Profile button without specifying the user's gender
            await spec.pause(2000);
            await spec.press('PostButton');
            await spec.pause(3000);

            // This is the test oracle = when a user tries to click the Update Profile button ('PostButton')
            // but has not given all of the required information, then the 'PostButton' should continue to exist.
            // Note that if all required info is given, then the 'PostButton' would be disabled and turned to
            // the 'DisabledButton'.
            await spec.exists('PostButton');
            await spec.notExists('DisabledButton');
        });
    });

    spec.describe('Updating Profile and properly filling in all required fields', function() {
        spec.it('fourth test', async function() {

            // Fill in the user's gender
            await spec.fillIn('GenderInput', 'Male');

            // Fill in the user's name
            await spec.fillIn('NameInput', 'Victor');

            // Fill in the user's description 
            await spec.fillIn('DescriptionInput', 'This test tries to update a profile properly.');

            // Add the sport Basketball to the profile, and specify a level of 'Expert'
            await spec.fillIn('BasketballLevelInput', 'Expert');
            await spec.press('BasketballButton');

            // After filling in all of the required information, hit the Update Profile button
            await spec.pause(2000);
            await spec.press('PostButton');
            await spec.pause(3000);

            // This is the test oracle = when a user has filled in all of the required fields on the form 
            // and hits the Update Profile button ('PostButton'), it should do a backend request to update
            // the user's profile in the database and then the 'PostButton' will be disabled and turned into the 
            // 'DisabledButton'. We make sure this behaviour is indeed followed by executing the next two
            // statements
            await spec.exists('DisabledButton');
            await spec.notExists('PostButton');
        });
    });
}