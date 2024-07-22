//# RUN -> npm install moment
//# Run the file -> node alarm.js

const readline = require('readline');
const moment = require('moment');

class Alarm {
    constructor(time, day) {
        this.time = moment(time, 'HH:mm');
        this.day = day;
        this.snoozeCount = 0;
    }

    snooze() {
        if (this.snoozeCount < 3) {
            this.time.add(5, 'minutes');
            this.snoozeCount++;
        } else {
            console.log('Snooze limit reached');
        }
    }

    toString() {
        return `${this.time.format('HH:mm')} on ${this.day}`;
    }

    checkAlarm(currentTime) {
        return this.time.isSame(currentTime, 'minute') && this.day === currentTime.format('dddd');
    }
}

class AlarmClock {
    constructor() {
        this.alarms = [];
        this.init();
    }

    init() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.showMenu();
        this.startCheckingAlarms();
    }

    showMenu() {
        console.log(`
        1. Show current time
        2. Set an alarm
        3. Snooze an alarm
        4. Delete an alarm
        5. Show current alarms
        6. Exit
        `);
        this.rl.question('Choose an option: ', (option) => {
            switch (option) {
                case '1':
                    this.showCurrentTime();
                    break;
                case '2':
                    this.setAlarm();
                    break;
                case '3':
                    this.snoozeAlarm();
                    break;
                case '4':
                    this.deleteAlarm();
                    break;
                case '5':
                    this.showCurrentAlarms();
                    break;
                case '6':
                    this.exit();
                    break;
                default:
                    console.log('Invalid option');
                    this.showMenu();
            }
        });
    }

    showCurrentTime() {
        console.log(`Current time: ${moment().format('HH:mm:ss')}`);
        this.showMenu();
    }

    setAlarm() {
        this.rl.question('Enter alarm time (HH:mm): ', (time) => {
            this.rl.question('Enter day of the week (e.g., Monday): ', (day) => {
                const newAlarm = new Alarm(time, day);
                this.alarms.push(newAlarm);
                console.log('Alarm set successfully');
                this.showMenu();
            });
        });
    }

    snoozeAlarm() {
        if (this.alarms.length === 0) {
            console.log('No alarms set');
            this.showMenu();
            return;
        }

        this.rl.question('Enter the index of the alarm to snooze: ', (index) => {
            index = parseInt(index);
            if (index >= 0 && index < this.alarms.length) {
                this.alarms[index].snooze();
                console.log('Alarm snoozed to ' + this.alarms[index].toString());
            } else {
                console.log('Invalid alarm index');
            }
            this.showMenu();
        });
    }

    deleteAlarm() {
        if (this.alarms.length === 0) {
            console.log('No alarms set');
            this.showMenu();
            return;
        }

        this.rl.question('Enter the index of the alarm to delete: ', (index) => {
            index = parseInt(index);
            if (index >= 0 && index < this.alarms.length) {
                this.alarms.splice(index, 1);
                console.log('Alarm deleted');
            } else {
                console.log('Invalid alarm index');
            }
            this.showMenu();
        });
    }

    showCurrentAlarms() {
        if (this.alarms.length === 0) {
            console.log('No alarms set');
        } else {
            console.log('Current alarms:');
            this.alarms.forEach((alarm, index) => {
                console.log(`${index}: ${alarm.toString()}`);
            });
        }
        this.showMenu();
    }

    startCheckingAlarms() {
        setInterval(() => {
            const currentTime = moment();
            this.alarms.forEach((alarm, index) => {
                if (alarm.checkAlarm(currentTime)) {
                    console.log(`\nAlarm ringing: ${alarm.toString()}`);
                    this.rl.question('Do you want to snooze the alarm? (yes/no): ', (answer) => {
                        if (answer.toLowerCase() === 'yes') {
                            alarm.snooze();
                            console.log('Alarm snoozed to ' + alarm.toString());
                        } else {
                            this.alarms.splice(index, 1);
                            console.log('Alarm dismissed');
                        }
                        this.showMenu();
                    });
                }
            });
        }, 1000);
    }

    exit() {
        console.log('Exiting...');
        this.rl.close();
        process.exit(0);
    }
}

const alarmClock = new AlarmClock();
