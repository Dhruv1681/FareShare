/**
 * Interface representing an activity.
 * @interface
 */
export default interface Activity {
    /**
     * The unique identifier for the activity.
     * @type {string}
     */
    id: string;

    /**
     * The type of entity associated with the activity (e.g., "transaction").
     * @type {string}
     */
    entity: string;

    /**
     * The unique identifier of the associated entity.
     * @type {string}
     */
    entityId: string;

    /**
     * An array of objects containing text and bold properties for formatting.
     * @type {{ text: string; bold: boolean }[]}
     */
    textData: { text: string; bold: boolean }[];

    /**
     * The main text of the activity.
     * @type {string}
     */
    text: string;

    /**
     * The color of the text (e.g., "red").
     * @type {string}
     */
    textColor: string;

    /**
     * The username associated with the activity.
     * @type {string}
     */
    username: string;

    /**
     * Indicates whether the activity has been read.
     * @type {boolean}
     */
    read: boolean;

    /**
     * The timestamp when the activity was created.
     * @type {string}
     */
    createdOn: string;

    /**
     * The timestamp when the activity was last updated (null if never updated).
     * @type {string | null}
     */
    updatedOn: string | null;

    /**
     * The user who created the activity (null if not available).
     * @type {string | null}
     */
    createdBy: string | null;

    /**
     * The user who last updated the activity (null if not available).
     * @type {string | null}
     */
    updatedBy: string | null;

    /**
     * Indicates whether the activity has been deleted.
     * @type {boolean}
     */
    deleted: boolean;
}
