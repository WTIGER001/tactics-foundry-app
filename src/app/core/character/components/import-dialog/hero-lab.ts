import { Observable, ReplaySubject } from 'rxjs';
import * as xml2js from 'xml2js';
import { Character, Attribute, Roll, Weapon, Skill } from '../../character';


export class HeroLabCharacter {

    public static importData(data: string): Observable<Character[]> {
        const rtn = new ReplaySubject<Character[]>()
        console.log("DATA, ", data);

        xml2js.parseString(data, (err, result) => {
            const items: Character[] = []
            result.document.public[0].character.forEach(c => {
                let chr = HeroLabCharacter.readCharacter(c)
                items.push(chr)
            })
            rtn.next(items)
            rtn.complete()
        })

        return rtn
    }

    private static toBool(v: string, defaultval: boolean = false): boolean {
        if (!v) {
            return defaultval
        }
        return v.toUpperCase() == 'YES' ? true : false
    }
    private static readCharacter(hero: any): Character {
        const chr = new Character()

        chr.name = hero.$.name
        chr.alignment = hero.alignment[0].$.name
        chr.size = hero.size[0].$.name
        chr.reach = hero.size[0].reach[0].$.value
        chr.classes = hero.classes[0].$.summary
        HeroLabCharacter.addAttr(chr, Attribute.build("HP", hero.health[0].$.hitpoints, hero.health[0].$.currenthp))
        

        hero.attributes[0].attribute.forEach(a => {
            // Atrributes are really abilites
            const name = a.$.name.toLowerCase()
            const ab = chr.abilityScores.find(a => a.name.toLowerCase() == name)
            if (ab) {
                ab.score = a.attrvalue[0].$.base
            }
        })
        hero.saves[0].save.forEach(a => {
            HeroLabCharacter.addAttr(chr, Attribute.build(a.$.abbr, a.$.save))
        })
        HeroLabCharacter.addAttr(chr, Attribute.build("AC", hero.armorclass[0].$.ac))
        HeroLabCharacter.addAttr(chr, Attribute.build("Touch AC", hero.armorclass[0].$.touch))
        HeroLabCharacter.addAttr(chr, Attribute.build("Flatfooted AC", hero.armorclass[0].$.flatfooted))
        HeroLabCharacter.addAttr(chr, Attribute.build("Initiative", hero.initiative[0].$.total))

        chr.speed = hero.movement[0].speed[0].$.value

        if (hero.melee && hero.melee[0].weapon) {
            hero.melee[0].weapon.forEach(w => { HeroLabCharacter.importWeapon(w, chr) })
        }

        if (hero.ranged && hero.ranged[0].weapon) {
            hero.melee[0].weapon.forEach(w => { HeroLabCharacter.importWeapon(w, chr) })
        }

        // Add popular Rolls
        HeroLabCharacter.addIfNeeded(chr.rolls, Roll.from("Initiative", "d20 +Initiative"))
        HeroLabCharacter.addSkills(chr.skills, hero)
        return chr
    }

    private static importWeapon(w: any, chr: Character) {
        try {
            const weapon = new Weapon()
            weapon.name = w.$.name
            weapon.type = "Melee"
            weapon.damageType = w.$.typetext
            weapon.attackBonus = parseInt(w.$.attack)
            weapon.critical = w.$.crit
            weapon.damage = w.$.damage
            if (w.description && w.description[0]) {
                weapon.description = w.description[0]
            }
            if (w.weight && w.weight[0]) {
                weapon.weight = parseFloat(w.weight[0].$.value)
            }
            if (w.cost && w.cost[0]) {
                weapon.cost = parseFloat(w.cost[0].$.value)
            }
            chr.weapons.push(weapon)

            HeroLabCharacter.addIfNeeded(chr.rolls, (Roll.from(w.$.name + " Attack", w.$.attack)))
            HeroLabCharacter.addIfNeeded(chr.rolls, (Roll.from(w.$.name + " Dmg", w.$.damage)))
        } catch (error) {
            console.log("ERROR DURING IMPORT, MELEE WEAPON ", w.$.name);
        }
    }

    private static addSkills(skills: Skill[], hero: any) {
        hero.skills[0].skill.forEach(sk => {
            const skill = new Skill()
            skill.name = sk.$.name
            skill.ranks = parseInt(sk.$.ranks)
            skill.ability = sk.$.attrname
            skill.armorCheckPenalty = this.toBool(sk.$.armorcheck)
            skill.classSkill = this.toBool(sk.$.classskill)
            if (sk.description && sk.description[0]) {
                skill.description = sk.description[0]
            }
            skill.untrained = !this.toBool(sk.$.trainedonly)
            if (sk.$.tools && sk.$.tools === 'needs') {
                skill.needsTools = true
            }

            const indx = skills.findIndex(s => s.name.toLowerCase() === skill.name.toLowerCase())
            if (indx) {
                skills[indx] = skill
            } else {
                skills.push(skill)
            }
        })
    }

    private static addAttr(chr: Character,  attr : Attribute) {
        const indx = chr.attributes.findIndex( a => a.name.toLowerCase() === attr.name.toLowerCase())
        if (indx >= 0) {
            chr.attributes[indx] = attr
        } else {
            chr.attributes.push(attr)
        }
    }

    private static addIfNeeded(rolls: Roll[], r: Roll) {
        let indx = rolls.findIndex(r1 => r1.name == r.name)
        if (indx < 0) {
            rolls.push(r)
        }
    }
}