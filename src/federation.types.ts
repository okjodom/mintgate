export interface Federation {
    federation_id: string,
    mint_pubkey: string
    description: string
    date_created: string,
    details: FederationDetails
}

export interface FederationDetails {
    name: string
    description: string
    url?: string
}
