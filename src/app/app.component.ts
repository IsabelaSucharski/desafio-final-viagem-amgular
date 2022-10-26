import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CountriesService } from './countries.service';

interface Cities {
  city: string;
  latitude: string;
  longitude: string;
}
interface Coutries {
  country: string;
  cities: Cities[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  countries: Coutries[] = [];
  cidadesOrigem: Cities[] = [];
  latitudeOrigem: any = '';
  longitudeOrigem: any = '';
  cidadesDestino: Cities[] = [];
  latitudeDestino: any = '';
  longitudeDestino: any = '';
  criancas: number = 0;
  adultos: number = 1;
  distanciaViagem: number = 0;
  valorAbatidoMilhas: any = '';
  valorAdulto: any = '';
  valorCrianca: any = '';
  totalViagem: any = '';

  constructor(private countriesService: CountriesService) {}

  validateMinAdults: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const adultos = control.get('adultos')?.value;
    return adultos < 1 ? { errorMinAdults: true } : null;
  };

  validateCitiesOriginDestiny: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const cidadeOrigem = control.get('cidadeOrigem')?.value;
    const cidadeDestino = control.get('cidadeDestino')?.value;
    return cidadeOrigem === cidadeDestino
      ? { errorCitiesOriginDestiny: true }
      : null;
  };

  myForm = new FormGroup(
    {
      paisOrigem: new FormControl('Brasil'),
      cidadeOrigem: new FormControl('São Paulo'),
      paisDestino: new FormControl('Canadá'),
      cidadeDestino: new FormControl('Ottawa'),
      classe: new FormControl('Econômica'),
      adultos: new FormControl(1),
      criancas: new FormControl(0),
      milhas: new FormControl(15000),
    },
    {
      validators: [this.validateMinAdults, this.validateCitiesOriginDestiny],
    }
  );

  ngOnInit(): void {
    this.setValues();
  }

  setValues = () => {
    this.countriesService.get().subscribe((country: any) => {
      this.countries = country;

      let filtroPaisOrigem = country.filter((c: any) => {
        return c.country === this.myForm.get('paisOrigem')?.value;
      });

      filtroPaisOrigem.filter(({ cities }: any) => {
        this.cidadesOrigem = cities;

        let cidade = this.cidadesOrigem.filter(({ city }) => {
          return city === this.myForm.get('cidadeOrigem')?.value;
        });

        cidade.map(({ latitude, longitude }) => {
          this.latitudeOrigem = latitude;
          this.longitudeOrigem = longitude;
        });
      });

      let filtroPaisDestino = country.filter((c: any) => {
        return c.country === this.myForm.get('paisDestino')?.value;
      });

      filtroPaisDestino.filter(({ cities }: any) => {
        this.cidadesDestino = cities;

        let cidade = this.cidadesDestino.filter(({ city }) => {
          return city === this.myForm.get('cidadeDestino')?.value;
        });

        cidade.map(({ latitude, longitude }) => {
          this.latitudeDestino = latitude;
          this.longitudeDestino = longitude;
        });
      });
    });
  };

  origem = (value: any) => {
    this.myForm.patchValue({ cidadeOrigem: '' });

    let filtroPaisOrigem = this.countries.filter((c: any) => {
      return c.country === value;
    });

    filtroPaisOrigem.filter(({ cities }: any) => {
      this.cidadesOrigem = cities;
    });
  };

  setValuesOrigem = (valor: any) => {
    let cidade = this.cidadesOrigem.filter(({ city }) => {
      return city === valor;
    });

    cidade.map(({ latitude, longitude }) => {
      this.latitudeOrigem = latitude;
      this.longitudeOrigem = longitude;
    });
  };

  setValuesDestino = (valor: any) => {
    let cidade = this.cidadesDestino.filter(({ city }) => {
      return city === valor;
    });

    cidade.map(({ latitude, longitude }) => {
      this.latitudeDestino = latitude;
      this.longitudeDestino = longitude;

      this.distanciaViagem = this.getDistance(
        this.latitudeOrigem,
        this.longitudeOrigem,
        this.latitudeDestino,
        this.longitudeDestino
      );

      this.setPrecoViagem();
    });
  };

  destino = (value: any) => {
    this.myForm.patchValue({ cidadeDestino: '' });

    let filtroPaisDestino = this.countries.filter((c: any) => {
      return c.country === value;
    });

    filtroPaisDestino.filter(({ cities }: any) => {
      this.cidadesDestino = cities;
    });
  };

  adicionarValor = (tipo: any) => {
    if (tipo === 'criancas') {
      this.criancas++;
      this.myForm.patchValue({ criancas: this.criancas });
    } else {
      this.adultos++;
      this.myForm.patchValue({ adultos: this.adultos });
    }
  };

  subtrairValor = (tipo: any) => {
    if (tipo === 'criancas') {
      this.criancas--;
      this.myForm.patchValue({ criancas: this.criancas });
    } else {
      this.adultos--;
      this.myForm.patchValue({ adultos: this.adultos });
    }

    if (this.adultos < 0) {
      this.adultos = 0;
      this.myForm.patchValue({ adultos: this.adultos });
    }

    if (this.criancas < 0) {
      this.criancas = 0;
      this.myForm.patchValue({ criancas: this.criancas });
    }
  };

  getDistance = (
    originLatitude: number,
    originLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number
  ) => {
    const EARTH_RADIUS = 6_371.071; // Earth
    const diffLatitudeRadians = this.degreesToRadians(
      destinationLatitude - originLatitude
    );
    const diffLongitudeRadians = this.degreesToRadians(
      destinationLongitude - originLongitude
    );
    const originLatitudeRadians = this.degreesToRadians(originLatitude);
    const destinationLatitudeRadians =
      this.degreesToRadians(destinationLatitude);
    const kmDistance =
      2 *
      EARTH_RADIUS *
      Math.asin(
        Math.sqrt(
          Math.sin(diffLatitudeRadians / 2) *
            Math.sin(diffLatitudeRadians / 2) +
            Math.cos(originLatitudeRadians) *
              Math.cos(destinationLatitudeRadians) *
              Math.sin(diffLongitudeRadians / 2) *
              Math.sin(diffLongitudeRadians / 2)
        )
      );
    return kmDistance;
  };

  degreesToRadians = (value: number) => {
    return (value * Math.PI) / 180;
  };

  setPrecoViagem = () => {
    let valorPassagemAdulto = 0;
    let valorPassagemCrianca = 0;
    if (
      this.myForm.get('paisOrigem')?.value ===
      this.myForm.get('paisDestino')?.value
    ) {
      console.log('1');
      valorPassagemAdulto = this.distanciaViagem * 0.3;
      valorPassagemCrianca = this.distanciaViagem * 0.15;
    } else {
      console.log('2');

      valorPassagemAdulto = this.distanciaViagem * 0.5;
      valorPassagemCrianca = this.distanciaViagem * 0.25;
    }

    if (this.myForm.get('classe')?.value === 'Executiva') {
      console.log('3');

      valorPassagemAdulto = valorPassagemAdulto * 1.8;
      valorPassagemCrianca = valorPassagemCrianca * 1.4;
    }

    if (Number(this.myForm.get('milhas')?.value) > 0) {
      console.log('4');

      let valorAbatido = Number(this.myForm.get('milhas')?.value) * 0.02;
      this.valorAbatidoMilhas = valorAbatido.toLocaleString();
    }

    this.valorAdulto = valorPassagemAdulto.toLocaleString();
    this.valorCrianca = valorPassagemCrianca.toLocaleString();

    this.totalViagem = (
      this.adultos * valorPassagemAdulto +
      this.criancas * valorPassagemCrianca -
      this.valorAbatidoMilhas
    ).toLocaleString();
  };
}
