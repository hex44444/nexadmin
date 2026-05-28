// Comprehensive list of time zones
const TIMEZONES = [
    // Africa
    { name: 'Africa/Cairo', utc: 'UTC+2' },
    { name: 'Africa/Johannesburg', utc: 'UTC+2' },
    { name: 'Africa/Lagos', utc: 'UTC+1' },
    { name: 'Africa/Nairobi', utc: 'UTC+3' },
    
    // Americas
    { name: 'America/New_York', utc: 'UTC-5/-4' },
    { name: 'America/Chicago', utc: 'UTC-6/-5' },
    { name: 'America/Denver', utc: 'UTC-7/-6' },
    { name: 'America/Los_Angeles', utc: 'UTC-8/-7' },
    { name: 'America/Anchorage', utc: 'UTC-9/-8' },
    { name: 'America/Toronto', utc: 'UTC-5/-4' },
    { name: 'America/Mexico_City', utc: 'UTC-6/-5' },
    { name: 'America/Buenos_Aires', utc: 'UTC-3' },
    { name: 'America/Santiago', utc: 'UTC-3/-4' },
    { name: 'America/São_Paulo', utc: 'UTC-3/-2' },
    
    // Asia
    { name: 'Asia/Dubai', utc: 'UTC+4' },
    { name: 'Asia/Kolkata', utc: 'UTC+5:30' },
    { name: 'Asia/Bangkok', utc: 'UTC+7' },
    { name: 'Asia/Hong_Kong', utc: 'UTC+8' },
    { name: 'Asia/Shanghai', utc: 'UTC+8' },
    { name: 'Asia/Tokyo', utc: 'UTC+9' },
    { name: 'Asia/Seoul', utc: 'UTC+9' },
    { name: 'Asia/Singapore', utc: 'UTC+8' },
    { name: 'Asia/Jakarta', utc: 'UTC+7' },
    { name: 'Asia/Manila', utc: 'UTC+8' },
    { name: 'Asia/Istanbul', utc: 'UTC+3' },
    { name: 'Asia/Karachi', utc: 'UTC+5' },
    
    // Europe
    { name: 'Europe/London', utc: 'UTC+0/+1' },
    { name: 'Europe/Paris', utc: 'UTC+1/+2' },
    { name: 'Europe/Berlin', utc: 'UTC+1/+2' },
    { name: 'Europe/Rome', utc: 'UTC+1/+2' },
    { name: 'Europe/Amsterdam', utc: 'UTC+1/+2' },
    { name: 'Europe/Madrid', utc: 'UTC+1/+2' },
    { name: 'Europe/Vienna', utc: 'UTC+1/+2' },
    { name: 'Europe/Moscow', utc: 'UTC+3' },
    { name: 'Europe/Istanbul', utc: 'UTC+3' },
    { name: 'Europe/Athens', utc: 'UTC+2/+3' },
    { name: 'Europe/Dublin', utc: 'UTC+0/+1' },
    { name: 'Europe/Lisbon', utc: 'UTC+0/+1' },
    { name: 'Europe/Warsaw', utc: 'UTC+1/+2' },
    { name: 'Europe/Prague', utc: 'UTC+1/+2' },
    { name: 'Europe/Stockholm', utc: 'UTC+1/+2' },
    { name: 'Europe/Helsinki', utc: 'UTC+2/+3' },
    
    // Oceania
    { name: 'Australia/Sydney', utc: 'UTC+10/+11' },
    { name: 'Australia/Melbourne', utc: 'UTC+10/+11' },
    { name: 'Australia/Brisbane', utc: 'UTC+10' },
    { name: 'Australia/Perth', utc: 'UTC+8' },
    { name: 'Australia/Adelaide', utc: 'UTC+9:30/+10:30' },
    { name: 'Pacific/Auckland', utc: 'UTC+12/+13' },
    { name: 'Pacific/Fiji', utc: 'UTC+12/+13' },
    { name: 'Pacific/Honolulu', utc: 'UTC-10' },
];

// Default time zones to show on load
const DEFAULT_TIMEZONES = [
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
];

class DigitalClock {
    constructor() {
        this.activeClocksContainer = document.getElementById('clocksContainer');
        this.searchInput = document.getElementById('searchInput');
        this.timezoneSelect = document.getElementById('timezoneSelect');
        this.addBtn = document.getElementById('addBtn');
        this.activeTimezones = [];
        
        this.init();
    }

    init() {
        this.populateTimezoneSelect();
        this.addEventListeners();
        this.loadDefaultTimezones();
        this.startClocks();
    }

    populateTimezoneSelect() {
        TIMEZONES.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz.name;
            option.textContent = `${tz.name} (${tz.utc})`;
            this.timezoneSelect.appendChild(option);
        });
    }

    addEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTimezone());
        this.timezoneSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.addTimezone(e.target.value);
                e.target.value = '';
            }
        });

        this.searchInput.addEventListener('input', (e) => {
            this.filterTimezones(e.target.value);
        });
    }

    filterTimezones(searchTerm) {
        const filtered = TIMEZONES.filter(tz =>
            tz.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.timezoneSelect.innerHTML = '<option value="">-- Select to Add Time Zone --</option>';
        filtered.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz.name;
            option.textContent = `${tz.name} (${tz.utc})`;
            this.timezoneSelect.appendChild(option);
        });
    }

    addTimezone(tzName = null) {
        const timezone = tzName || this.timezoneSelect.value;
        
        if (!timezone || this.activeTimezones.includes(timezone)) {
            alert('This timezone is already added!');
            return;
        }

        this.activeTimezones.push(timezone);
        this.renderClocks();
        this.saveToLocalStorage();
    }

    removeTimezone(timezone) {
        this.activeTimezones = this.activeTimezones.filter(tz => tz !== timezone);
        this.renderClocks();
        this.saveToLocalStorage();
    }

    loadDefaultTimezones() {
        const saved = localStorage.getItem('activeTimezones');
        if (saved) {
            this.activeTimezones = JSON.parse(saved);
        } else {
            this.activeTimezones = DEFAULT_TIMEZONES;
        }
        this.renderClocks();
    }

    saveToLocalStorage() {
        localStorage.setItem('activeTimezones', JSON.stringify(this.activeTimezones));
    }

    renderClocks() {
        this.activeClocksContainer.innerHTML = '';

        if (this.activeTimezones.length === 0) {
            this.activeClocksContainer.innerHTML = '<div class="no-clocks">No time zones selected. Add one to get started!</div>';
            return;
        }

        this.activeTimezones.forEach(timezone => {
            const clockElement = this.createClockElement(timezone);
            this.activeClocksContainer.appendChild(clockElement);
        });
    }

    createClockElement(timezone) {
        const clock = document.createElement('div');
        clock.className = 'clock';
        clock.innerHTML = `
            <div class="clock-header">
                <div class="timezone-name">${timezone.replace(/_/g, ' ')}</div>
                <button class="remove-btn" data-timezone="${timezone}">✕</button>
            </div>
            <div class="digital-display">
                <div class="time" data-time="${timezone}">--:--:--</div>
                <div class="date" data-date="${timezone}">--/--/----</div>
            </div>
            <div class="analog-clock" data-analog="${timezone}">
                <div class="hand hour-hand" data-hour="${timezone}"></div>
                <div class="hand minute-hand" data-minute="${timezone}"></div>
                <div class="hand second-hand" data-second="${timezone}"></div>
                <div class="clock-center"></div>
            </div>
            <div class="info">
                <div class="info-item">
                    <div class="info-label">UTC Offset</div>
                    <div class="info-value offset" data-offset="${timezone}">+00:00</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Day of Week</div>
                    <div class="info-value" data-day="${timezone}">Monday</div>
                </div>
            </div>
        `;

        clock.querySelector('.remove-btn').addEventListener('click', (e) => {
            this.removeTimezone(e.target.dataset.timezone);
        });

        return clock;
    }

    startClocks() {
        this.updateAllClocks();
        setInterval(() => this.updateAllClocks(), 1000);
    }

    updateAllClocks() {
        this.activeTimezones.forEach(timezone => {
            this.updateClock(timezone);
        });
    }

    updateClock(timezone) {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const parts = formatter.formatToParts(now);
        const timeData = {};
        parts.forEach(part => {
            timeData[part.type] = part.value;
        });

        // Update digital time
        const timeElement = document.querySelector(`[data-time="${timezone}"]`);
        if (timeElement) {
            timeElement.textContent = `${timeData.hour}:${timeData.minute}:${timeData.second}`;
        }

        // Update date
        const dateElement = document.querySelector(`[data-date="${timezone}"]`);
        if (dateElement) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthName = months[parseInt(timeData.month) - 1];
            dateElement.textContent = `${monthName} ${timeData.day}, ${timeData.year}`;
        }

        // Update day of week
        const dayElement = document.querySelector(`[data-day="${timezone}"]`);
        if (dayElement) {
            const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            dayElement.textContent = days[tzDate.getDay()];
        }

        // Update UTC offset
        const offsetElement = document.querySelector(`[data-offset="${timezone}"]`);
        if (offsetElement) {
            offsetElement.textContent = this.calculateUTCOffset(timezone);
        }

        // Update analog clock
        this.updateAnalogClock(timezone, parseInt(timeData.hour), parseInt(timeData.minute), parseInt(timeData.second));
    }

    calculateUTCOffset(timezone) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'longOffset'
        });

        const parts = formatter.formatToParts(new Date());
        const offsetPart = parts.find(p => p.type === 'timeZoneName');
        return offsetPart ? offsetPart.value : 'UTC+00:00';
    }

    updateAnalogClock(timezone, hour, minute, second) {
        // Hour hand
        const hourHand = document.querySelector(`[data-hour="${timezone}"]`);
        if (hourHand) {
            const hourDegrees = (hour % 12) * 30 + (minute / 60) * 30;
            hourHand.style.transform = `rotate(${hourDegrees}deg)`;
        }

        // Minute hand
        const minuteHand = document.querySelector(`[data-minute="${timezone}"]`);
        if (minuteHand) {
            const minuteDegrees = minute * 6 + (second / 60) * 6;
            minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        }

        // Second hand
        const secondHand = document.querySelector(`[data-second="${timezone}"]`);
        if (secondHand) {
            const secondDegrees = second * 6;
            secondHand.style.transform = `rotate(${secondDegrees}deg)`;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalClock();
});
