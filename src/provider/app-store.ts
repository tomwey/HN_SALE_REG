import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class AppStore {
    constructor(private storage: Storage, private events: Events) {
        // console.log('Hello ApiService Provider');
    }

    saveObject(obj: any, key: string) {
        return this.storage.set(key, JSON.stringify(obj));
    }

    getObject(key: string, callback) {
        this.storage.get(key)
            .then(data => {
                if (callback) {
                    if (!data) {
                        callback(null);
                    } else {
                        callback(JSON.parse(data));
                    }
                    
                }
            });
    }

    saveProject(projData) {
        this.events.publish('project:changed', projData);
        return this.saveObject(projData, 'selected:project');
    }

    getProject(callback) {
        this.getObject('selected:project', callback);
    }
} 