"""
Assembles the zone configurations for each quest
into one file. Every quest that is in quest_dir
and every zone that is in each quest will be
included.

Example output:

    {
        quest1: [
            {
                zone: A,
                ...
            },
            {
                zone: B,
                ...
            }
        ],
        quest2: [
            {
                zone: X,
                ...
            }
        ]
    }

"""

import json
import os

quest_dir = 'src/quests'
output_path = 'src/quests.json'
output = {}

for quest in os.listdir(quest_dir):
    questPath = os.path.join(quest_dir, quest)

    if os.path.isdir(questPath):
        output[quest] = {
            'zones': []
        }

        for zone in sorted(os.listdir(questPath)):
            if os.path.isdir(os.path.join(questPath, zone)):
                with open(os.path.join(questPath, zone, 'zone.json')) as f:
                    data = json.load(f)
                    output[quest]['zones'].append(data)

with open(output_path, 'w') as output_file:
    json.dump(output, output_file, indent=4)
    print 'Generated ' + output_path
