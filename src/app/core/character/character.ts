import { TokenAnnotation, ObjectType, TokenBar } from '../model';
import * as MathJS from 'mathjs'
import { isArray } from 'util';
import { LangUtil } from '../util/LangUtil';


export class Character extends ObjectType {
    static readonly TYPE ='character'

    public name = 'New Character'
    public objType = Character.TYPE
    public owner : string
    public url : string
    public speed: string
    public vision: string
    public reach: string
    public size: string

    public race: string
    public classes: string
    public alignment: string
    public conditions: any

    public attributes: Attribute[]  = new PathfinderDefaults().attributes
    public skills : Skill[] = new PathfinderDefaults().skills
    public abilityScores : AbilityScore[] = new PathfinderDefaults().abilityScores
    public rolls : Roll[] = []
    public weapons : Weapon[] = []

    calculateAll() {
        this.attributes.forEach(a => {
            this.calculate(a)
        })
        this.rolls.forEach( r => {
            this.calculateRoll(r)
        })
    }

    calculateRoll(r: Roll) {
        r.expression = this.resolveFormula(r)
    }

    calculate(a: Attribute) {
        a.value = this.calculateValue(a)
        a.current = a.override ? a.override : a.value
    }

    private resolveFormula(a: Attribute | Roll) : string {
        //Look for brackets
        const variableRegex = /\[.*\]/g

        // Build a map of all the 
        const vars = new Map<string, number>()
        if (a.formula) {
            const matches = a.formula.toLowerCase().match(variableRegex) || []
            matches.forEach(match => {
                const name = match.replace('[', "").replace(']', '').toLowerCase()
                if (!vars.has(name)) {
                    const attr = this.attributes.find(a => a.name.toLowerCase() === name)
                    if (attr) {
                        const value = this.calculateValue(attr)
                        vars.set(name, value)
                    } else {
                        //Maybe it is an abilty score
                        const ability = this.abilityScores.find( a => {
                            if (a.name.toLowerCase() === name ||a.abbr.toLowerCase() == name) {
                                return true
                            }
                            if (a.name.toLowerCase()+"_mod" === name ||a.abbr.toLowerCase()+"_mod" == name) {
                                return true
                            }
                        })
                        if (ability) {
                            if (ability.name.toLowerCase() === name ||ability.abbr.toLowerCase() == name) {
                                vars.set(name,  ability.current)
                            }
                            if (ability.name.toLowerCase()+"_mod" === name ||ability.abbr.toLowerCase()+"_mod" == name) {
                                vars.set(name,  ability.tempMod)
                            }
                        } else {
                            vars.set(name, 0)
                        }
                    }
                }
            })

            // Replace all the 
            let formula = a.formula.toLowerCase()
            vars.forEach((value, key) => formula = formula.replace("[" + key + "]", "" + value))
            return formula
        }
        return ""
    }

    calculateValue(a: Attribute | Roll): number {
        //Look for brackets
        const variableRegex = /\[.*\]/g

        // Build a map of all the 
        const vars = new Map<string, number>()
        if (a.formula) {
            const matches = a.formula.toLowerCase().match(variableRegex) || []
            matches.forEach(match => {
                const name = match.replace('[', "").replace(']', '').toLowerCase()

                console.log("Looking for ", name)
                if (!vars.has(name)) {
                    const attr = this.attributes.find(a => a.name.toLowerCase() === name)
                    if (attr) {
                        const value = this.calculateValue(attr)
                        vars.set(name, value)
                    } else {
                        //Maybe it is an abilty score
                        const ability = this.abilityScores.find( a => {
                            if (a.name.toLowerCase() === name ||a.abbr.toLowerCase() == name) {
                                return true
                            }
                            if (a.name.toLowerCase()+"_mod" === name ||a.abbr.toLowerCase()+"_mod" == name) {
                                return true
                            }
                        })
                        if (ability) {
                            if (ability.name.toLowerCase() === name ||ability.abbr.toLowerCase() == name) {
                                vars.set(name,  ability.current)
                            }
                            if (ability.name.toLowerCase()+"_mod" === name ||ability.abbr.toLowerCase()+"_mod" == name) {
                                vars.set(name,  ability.tempMod)
                            }
                        } else {
                            vars.set(name, 0)
                        }
                    }
                }
            })

            // Replace all the 
            let formula = a.formula.toLowerCase()
            vars.forEach((value, key) => formula = formula.replace("[" + key + "]", "" + value))

            const result = MathJS.evaluate(formula)
            if (result._data) {
                return result._data[0]
            }
            return result
        } else {
            return 0
        }
    }

    static to(doc : any) : Character {
        const obj = new Character()
        LangUtil.copyFrom(obj, doc)

        // Ability Scores And skills
        const obj2 = new Character()
        obj.abilityScores = Character.mergeScores(obj2.abilityScores, doc.abilityScores)
        obj.skills = Character.mergeSkills(obj2.skills, doc.skills)

        return obj
    }

    static mergeScores(array1 : AbilityScore[], array2: AbilityScore[]) : AbilityScore[] {
        array2.forEach(i2 => {
            const indx = array1.findIndex( i1 => i1.name.toLowerCase() === i2.name.toLowerCase())
            if (indx >=0) {
                const item = array1[indx]
                LangUtil.copyFrom(item, i2)
            } else {
                const item = new AbilityScore()
                LangUtil.copyFrom(item, i2)
                array1.push(item)
            }
        });
        return array1
    }

    static mergeSkills(array1 : Skill[], array2: Skill[]) : Skill[] {
        array2.forEach(i2 => {
            const indx = array1.findIndex( i1 => i1.name.toLowerCase() === i2.name.toLowerCase())
            if (indx >=0) {
                const item = array1[indx]
                LangUtil.copyFrom(item, i2)
            } else {
                const item = new Skill()
                LangUtil.copyFrom(item, i2)
                array1.push(item)
            }
        });
        return array1
    }
}

export interface RollVariable {
    name: string
    value: number
}
export interface VariableProvider {
    getVariables(): RollVariable[]
}

export class Weapon {
    name: string
    attackBonus : number
    critical : string
    type : string;
    range: number
    ammunition : string
    damage: string
    description: string
    equiped: string
    magical: number
    masterwork : boolean
    damageType: string
    hp : number
    material: string
    cost: number
    weight: number
}

export class Roll {
    name: string
    formula: string
    expression : string
    description: string
    
    public static from(name : string, formula: string) : Roll{
        const a = new Roll()
        a.name = name;
        a.formula = formula
        return a
    }
}

export class Skill {
    name: string
    description: string
    ability: string
    classSkill : boolean = false
    ranks : number = 0
    mod : number = 0
    tools: boolean
    needsTools : boolean = false
    untrained: boolean = true
    armorCheckPenalty: boolean = false

    total(c : Character) : number {
        let total = this.ranks
        if (this.ability) {
            const ab = c.abilityScores.find(a => a.abbr.toLowerCase() === this.ability.toLowerCase())
            if (ab) {
                total += ab.tempMod
            }
        }
        total += this.mod
        if( this.classSkill) {
            total += 3
        }
        if (this.needsTools && !this.tools) {
            total -= 2
        }
        return total
    }

    static build(name: string, untrained : boolean, acp : boolean, ability : string, tools : boolean): Skill {
        let a = new Skill()
        a.name = name
        a.ability = ability.toUpperCase()
        a.untrained = untrained
        a.armorCheckPenalty = acp
        a.needsTools = tools
        return a
    }
}

export class Attribute {
    name: string
    override: number
    value: number = 0
    current: number = 0
    formula: string
    description: string
    format: boolean = false

    static build(name: string, v: string | number, c?: number): Attribute {
        let a = new Attribute()
        a.name = name
        a.formula = "" + v
        a.override = c
        return a
    }

    copy(): Attribute {
        let a = new Attribute()
        a.name = this.name
        a.value = this.value
        a.current = this.current
        a.formula = this.formula
        a.description = this.description
        a.override = this.override
        return a
    }
}

export class AbilityScore implements VariableProvider {
    name: string
    abbr: string
    tempAdjustment: number = 0
    score: number = 10

    get mod() : number {
        return this.getMod(this.score)
    }

    get tempMod()  : number{
        return this.getMod(this.current)
    }

    get current()  : number{
        return Number(this.score) + Number(this.tempAdjustment)
    }

    getVariables() {
        return [
            { name: this.abbr, value: this.current },
            { name: this.abbr + ' Mod', value: this.mod }
        ]
    }

    getMod(value: number) : number {
        return Math.trunc((value - 10) / 2)
    }

    static build(name: string, abbr: string, defaultValue: number): AbilityScore {
        const a = new AbilityScore()
        a.name = name
        a.abbr = abbr
        a.score = defaultValue
        return a
    }
}

export class PathfinderDefaults {
 
    public abilityScores : AbilityScore[] = [
        AbilityScore.build("Strength", "STR", 10),
        AbilityScore.build("Dexterity", "DEX", 10),
        AbilityScore.build("Constitution", "CON", 10),
        AbilityScore.build("Intelligence", "INT", 10),
        AbilityScore.build("Wisdom", "WIS", 10),
        AbilityScore.build("Charisma", "CHA", 10)
    ]

    public skills : Skill[] = [
        Skill.build('Acrobatics',true,true,'Dex',false),
        Skill.build('Appraise',true,false,'Int',false),
        Skill.build('Bluff',true,false,'Cha',false),
        Skill.build('Climb',true,true,'Str',false),
        Skill.build('Craft',true,false,'Int',true),
        Skill.build('Diplomacy',true,false,'Cha',false),
        Skill.build('Disable Device',false,true,'Dex',true),
        Skill.build('Disguise',true,false,'Cha',false),
        Skill.build('Escape Artist',true,true,'Dex',false),
        Skill.build('Fly',true,true,'Dex',false),
        Skill.build('Handle Animal',false,false,'Cha',false),
        Skill.build('Heal',true,false,'Wis',false),
        Skill.build('Intimidate',true,false,'Cha',false),
        Skill.build('Knowledge (arcana)',false,false,'Int',false),
        Skill.build('Knowledge (dungeoneering)',false,false,'Int',false),
        Skill.build('Knowledge (engineering)',false,false,'Int',false),
        Skill.build('Knowledge (geography)',false,false,'Int',false),
        Skill.build('Knowledge (history)',false,false,'Int',false),
        Skill.build('Knowledge (local)',false,false,'Int',false),
        Skill.build('Knowledge (nature)',false,false,'Int',false),
        Skill.build('Knowledge (nobility)',false,false,'Int',false),
        Skill.build('Knowledge (planes)',false,false,'Int',false),
        Skill.build('Knowledge (religion)',false,false,'Int',false),
        Skill.build('Linguistics',false,false,'Int',false),
        Skill.build('Perception',true,false,'Wis',false),
        Skill.build('Perform',true,false,'Cha',false),
        Skill.build('Profession',false,false,'Wis',false),
        Skill.build('Ride',true,true,'Dex',false),
        Skill.build('Sense Motive',true,false,'Wis',false),
        Skill.build('Sleight of Hand',false,true,'Dex',false),
        Skill.build('Spellcraft',false,false,'Int',false),
        Skill.build('Stealth',true,true,'Dex',false),
        Skill.build('Survival',true,false,'Wis',false),
        Skill.build('Swim',true,true,'Str',false),
        Skill.build('Use Magic Device',false,false,'Cha',false),
        Skill.build('Craft Alchemy',true,false,'Int',true),
        Skill.build('Craft Armor',true,false,'Int',true),
        Skill.build('Craft Baskets',true,false,'Int',true),
        Skill.build('Craft Books',true,false,'Int',true),
        Skill.build('Craft Bows',true,false,'Int',true),
        Skill.build('Craft Calligraphy',true,false,'Int',true),
        Skill.build('Craft Carpentry',true,false,'Int',true),
        Skill.build('Craft Cloth',true,false,'Int',true),
        Skill.build('Craft Clothing',true,false,'Int',true),
        Skill.build('Craft Glass',true,false,'Int',true),
        Skill.build('Craft Jewelry',true,false,'Int',true),
        Skill.build('Craft Leather',true,false,'Int',true),
        Skill.build('Craft Locks',true,false,'Int',true),
        Skill.build('Craft Paintings',true,false,'Int',true),
        Skill.build('Craft Pottery',true,false,'Int',true),
        Skill.build('Craft Sculptures',true,false,'Int',true),
        Skill.build('Craft Ships',true,false,'Int',true),
        Skill.build('Craft Shoes',true,false,'Int',true),
        Skill.build('Craft Stonemasonry',true,false,'Int',true),
        Skill.build('Craft Traps',true,false,'Int',true),
        Skill.build('Craft Weapons',true,false,'Int',true),

        



    ]

    public attributes : Attribute[] = [
        Attribute.build("HP", 0),
        Attribute.build("Level", 0),
        Attribute.build("AC", 10),
        Attribute.build("Flat Footed AC", 10),
        Attribute.build("Initiative", 0),
        Attribute.build("Speed", 0),
        Attribute.build("Touch AC", 10),
        Attribute.build("CMB", 0),
        Attribute.build("CMD", 0),
        Attribute.build("Base Attack Bonus", 0),
        Attribute.build("WILL", 0),
        Attribute.build("REF", 0),
        Attribute.build("FORT", 0),
    ]
}
